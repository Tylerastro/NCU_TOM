import authApi from "@/apis/auth-axios";

interface TokenResponse {
  access: string;
  access_expiration: Date;
}

export async function refreshToken(refresh: string): Promise<TokenResponse> {
  try {
    const response = await authApi.post("/api/token/refresh/", {
      refresh: refresh,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
