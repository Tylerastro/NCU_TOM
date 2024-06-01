import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function activateAccount(uid: string, token: string) {
  try {
    const response = await api.post("/api/users/activation/", {
      uid: uid,
      token: token,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
