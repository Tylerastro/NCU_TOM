import axios from "axios";
import { access } from "fs";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_HOST,
  withCredentials: true,
});

interface TokenResponse {
  refresh: string;
  access: string;
}

export async function loginWithGoogle(
  id_token: string
): Promise<TokenResponse> {
  try {
    const response = await api.post("/api/google/", {
      access_token: id_token,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function loginWithGithub(code: string): Promise<TokenResponse> {
  try {
    const response = await api.post("/api/github/", {
      access_token: code,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
