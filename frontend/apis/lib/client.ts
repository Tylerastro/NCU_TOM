import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";

// Detect if running on server or client
const isServer = typeof window === "undefined";

// Session cache to avoid calling getSession() on every request
const SESSION_CACHE_TTL = 30_000; // 30 seconds
let cachedSession: { data: Awaited<ReturnType<typeof getSession>>; timestamp: number } | null = null;
let pendingSessionPromise: Promise<Awaited<ReturnType<typeof getSession>>> | null = null;

function getCachedSession() {
  // If we have a valid cached session, return it
  if (cachedSession && Date.now() - cachedSession.timestamp < SESSION_CACHE_TTL) {
    return Promise.resolve(cachedSession.data);
  }

  // If a fetch is already in flight, share the same promise (deduplication)
  if (pendingSessionPromise) {
    return pendingSessionPromise;
  }

  // Start a new session fetch
  pendingSessionPromise = getSession()
    .then((session) => {
      cachedSession = { data: session, timestamp: Date.now() };
      pendingSessionPromise = null;
      return session;
    })
    .catch((err) => {
      pendingSessionPromise = null;
      throw err;
    });

  return pendingSessionPromise;
}

function invalidateSessionCache() {
  cachedSession = null;
  pendingSessionPromise = null;
}

// Use appropriate URL based on environment:
// - Server-side (NextAuth, API routes): use Docker internal hostname (django:8000)
// - Client-side (browser): use localhost:8000
const baseURL = isServer
  ? process.env.NEXT_PUBLIC_SERVER_API_HOST
  : process.env.NEXT_PUBLIC_API_URL;

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
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

/**
 * Main API client for authenticated requests
 */
export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

/**
 * Auth API client for authentication endpoints (login, register, etc.)
 * Does not attach JWT tokens automatically
 */
export const authApi: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor for authenticated API
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          params: config.params,
          data: config.data,
        }
      );
    }

    const session = await getCachedSession();

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

// Response interceptor for authenticated API
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Log error responses
    console.error(
      `🔴 API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
      {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      }
    );

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
        // Trigger NextAuth's token refresh via session update
        // NextAuth's jwt callback handles the actual refresh
        invalidateSessionCache();
        await fetch("/api/auth/session", { method: "GET" });
        const newSession = await getSession();

        if (newSession?.user?.accessToken) {
          onRefreshed(newSession.user.accessToken);
          originalRequest.headers.Authorization = `JWT ${newSession.user.accessToken}`;
          return api(originalRequest);
        }

        // If refresh failed, sign out
        await signOut({ callbackUrl: "/auth/signin" });
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
        console.warn(
          `🟡 Retrying request (${retryCount + 1}/${RETRY_CONFIG.maxRetries}) after ${delay}ms:`,
          {
            method: originalRequest.method?.toUpperCase(),
            url: originalRequest.url,
            error: error.message,
          }
        );

        // Wait for the calculated delay before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));

        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

// Simple logging interceptors for auth API
authApi.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🔵 Auth Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => {
    console.error("🔴 Auth Request Error:", error);
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🟢 Auth Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
        }
      );
    }
    return response;
  },
  (error) => {
    console.error(
      `🔴 Auth Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      }
    );
    return Promise.reject(error);
  }
);

// Export default as api for backwards compatibility during migration
export default api;
