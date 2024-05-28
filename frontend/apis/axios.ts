import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { refreshToken } from "./auth/refreshToken";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;

export const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add a request interceptor
axiosAuth.interceptors.request.use(
  async (config) => {
    const { data: session } = useSession();
    if (session && session.user.accessToken) {
      config.headers.Authorization = `JWT ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { data: session } = useSession();
      if (session && session.user.refreshToken) {
        const refreshedSession = await refreshToken(session.user.refreshToken);

        if (refreshedSession && refreshedSession.access) {
          originalRequest.headers.Authorization = `JWT ${refreshedSession.access}`;
          return axiosAuth(originalRequest);
        } else {
          // If refresh fails, log out the user
          await signOut();
        }
      }
    }
    return Promise.reject(error);
  }
);
