import api from "@/apis/axios";

import { Observation } from "@/models/observations";

export const getObservation = async (
  observationId: number
): Promise<Observation> => {
  try {
    const url = `/api/observations/` + observationId;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
