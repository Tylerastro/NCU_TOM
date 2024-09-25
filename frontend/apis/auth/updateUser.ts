import api from "@/apis/axios";
import { UserUpdate } from "@/models/users";

export const updateUser = async (userId: number, data: UserUpdate) => {
  try {
    const response = await api.put("/api/user/" + userId + "/edit/", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
