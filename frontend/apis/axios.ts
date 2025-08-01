import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// Helper function to determine if error is retryable
const isRetryableError = (error: AxiosError): boolean => {
  if (!error.response) return true; // Network errors are retryable
  return RETRY_CONFIG.retryableStatuses.includes(error.response.status);
};

// Exponential backoff delay calculation
const getRetryDelay = (retryCount: number): number => {
  return RETRY_CONFIG.retryDelay * Math.pow(2, retryCount);
};

// Token refresh mutex to prevent concurrent refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};

// Create an axios instance with common configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to handle session tokens and logging
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      });
    }

    const session = await getSession();

    if (session?.user?.accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `JWT ${session.user.accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("🔴 Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { 
      _retry?: boolean;
      _retryCount?: number;
    };
    
    // Log error responses
    console.error(`🔴 API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Handle 401 unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token is being refreshed, wait for it
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `JWT ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the session
        const session = await getSession();
        if (session?.user?.refreshToken) {
          // Token refresh logic would go here
          // For now, just sign out
          await signOut({ callbackUrl: "/auth/signin" });
        } else {
          await signOut({ callbackUrl: "/auth/signin" });
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        await signOut({ callbackUrl: "/auth/signin" });
      } finally {
        isRefreshing = false;
      }
    }

    // Handle retryable errors (network failures, server errors)
    if (isRetryableError(error) && originalRequest) {
      const retryCount = originalRequest._retryCount || 0;
      
      if (retryCount < RETRY_CONFIG.maxRetries) {
        originalRequest._retryCount = retryCount + 1;
        
        const delay = getRetryDelay(retryCount);
        console.warn(`🟡 Retrying request (${retryCount + 1}/${RETRY_CONFIG.maxRetries}) after ${delay}ms:`, {
          method: originalRequest.method?.toUpperCase(),
          url: originalRequest.url,
          error: error.message
        });
        
        // Wait for the calculated delay before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
