import axios, { AxiosInstance } from "axios";

// Separate axios instance for authentication endpoints
// Auth endpoints might need different base URL or configuration
const authApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_HOST || process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// Simple logging for auth requests
authApi.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🔵 Auth Request: ${config.method?.toUpperCase()} ${config.url}`);
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
      console.log(`🟢 Auth Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status
      });
    }
    return response;
  },
  (error) => {
    console.error(`🔴 Auth Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default authApi;