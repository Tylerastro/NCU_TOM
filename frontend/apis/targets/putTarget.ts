import { PutTarget, Target } from "@/models/targets";
import api from "@/apis/axios";

export const putTarget = async (target_id: number, target: PutTarget) => {
  try {
    const response = await api.put("/api/targets/" + target_id + "/", {
      ...target,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
