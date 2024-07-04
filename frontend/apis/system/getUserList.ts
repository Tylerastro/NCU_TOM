import { User } from "@/models/helpers";
import api from "../axiosAuth";

export const getUserList = async (): Promise<User[]> => {
  try {
    const response = await api.get("/api/list/users/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
