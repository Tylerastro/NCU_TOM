import { Target } from "@/models/targets";
import api from "../axiosAuth";

export const createTarget = async (newTarget: Target) => {
  try {
    const response = await api.post("/api/targets/", newTarget);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
