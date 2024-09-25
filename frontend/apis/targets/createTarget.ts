import { Target } from "@/models/targets";
import api from "@/apis/axios";

export const createTarget = async (newTarget: Target) => {
  try {
    const response = await api.post("/api/targets/", newTarget);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
