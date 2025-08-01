import authApi from "@/apis/auth-axios";

export async function activateAccount(uid: string, token: string) {
  try {
    const response = await authApi.post("/api/users/activation/", {
      uid: uid,
      token: token,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
