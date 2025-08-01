import authApi from "@/apis/auth-axios";

interface TokenResponse {
  refresh: string;
  access: string;
}

export async function loginWithGoogle(
  id_token: string
): Promise<TokenResponse> {
  try {
    const response = await authApi.post("/api/oauth/google/", {
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
    const response = await authApi.post("/api/oauth/github/", {
      access_token: code,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
