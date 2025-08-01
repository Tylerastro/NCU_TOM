import authApi from "@/apis/auth-axios";

interface TokenResponse {
  refresh: string;
  access: string;
}

export async function getToken(
  username: string,
  password: string
): Promise<TokenResponse> {
  try {
    const response = await authApi.post("/api/login/", {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
