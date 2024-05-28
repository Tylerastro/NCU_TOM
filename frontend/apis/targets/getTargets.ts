import api from "../axiosAuth";
import { Target } from "@/models/targets";

export const getTargets = async (targetId?: number): Promise<Target[]> => {
  try {
    let url = "/api/targets/";
    if (targetId) {
      url += `?target_id=${encodeURIComponent(targetId)}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
