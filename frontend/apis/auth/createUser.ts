import { NewUser } from "@/models/users";
import authApi from "@/apis/auth-axios";

export async function createUser(user: NewUser) {
  try {
    const response = await authApi.post("/api/users/", user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
