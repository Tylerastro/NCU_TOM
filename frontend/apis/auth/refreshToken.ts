import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_HOST,
  withCredentials: true,
});

interface TokenResponse {
  access: string;
  access_expiration: Date;
}

export async function refreshToken(refresh: string): Promise<TokenResponse> {
  try {
    const response = await api.post("/api/token/refresh/", {
      refresh: refresh,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
