import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

interface TokenResponse {
  refresh: string;
  access: string;
}

export async function getToken(
  username: string,
  password: string
): Promise<TokenResponse> {
  try {
    const response = await api.post("/api/jwt/create/", {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
