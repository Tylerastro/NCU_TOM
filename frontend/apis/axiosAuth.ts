import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.user?.accessToken) {
      config.headers.Authorization = `JWT ${session.user.accessToken}`;
    } else {
      // Prevent the request from being sent by throwing an error
      const error = new Error("No access token found");
      error.message = "Please sign in to continue";
      throw error;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
