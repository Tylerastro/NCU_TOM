import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function getUser(access_token: string) {
  try {
    const response = await api.get("/api/users/me/", {
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
