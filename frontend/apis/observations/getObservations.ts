import api from "../axiosAuth";
import { Observation } from "@/models/observations";

export const getObservations = async (
  observationId?: number
): Promise<Observation[]> => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/observations/`;
    if (observationId) {
      url += `?observation_id=${observationId}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
