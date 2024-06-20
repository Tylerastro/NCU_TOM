import api from "../axiosAuth";
import { Target } from "@/models/targets";

export const getTarget = async (targetId: number): Promise<Target> => {
  try {
    const url = `/api/targets/?target_id=${encodeURIComponent(targetId)}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
