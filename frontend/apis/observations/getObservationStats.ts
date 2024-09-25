import { ObservationStats } from "@/models/observations";
import api from "@/apis/axios";

export const getObservationStats = async (): Promise<ObservationStats> => {
  try {
    const response = await api.get(`/api/observations/stats/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
