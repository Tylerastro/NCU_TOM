import { UserProfile } from "@/models/users";
import api from "@/apis/axios";

export const getUserList = async (): Promise<UserProfile[]> => {
  try {
    const response = await api.get("/api/list/users/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
