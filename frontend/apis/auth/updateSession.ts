import api from "@/apis/axios";
import { unstable_update } from "@/auth";
import { UserUpdate } from "@/models/users";

export const updateSession = async () => {
  try {
    const response = await unstable_update;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
