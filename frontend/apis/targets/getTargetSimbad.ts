import api from "@/apis/axios";
import { TargetSimbad } from "@/models/targets";

export const getTargetSimbad = async (
  target_id: number
): Promise<TargetSimbad> => {
  try {
    const response = await api.get("/api/targets/" + target_id + "/simbad");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
