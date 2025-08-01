import authApi from "@/apis/auth-axios";

export async function getUser(access_token: string) {
  try {
    const response = await authApi.get("/api/user/", {
      headers: {
        Authorization: `JWT ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
