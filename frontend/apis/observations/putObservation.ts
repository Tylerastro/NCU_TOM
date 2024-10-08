import api from "@/apis/axios";

import { ObservationUpdate } from "@/models/observations";

export const putObservation = async (
  id: number,
  observation: ObservationUpdate
) => {
  try {
    const response = await api.put(`/api/observations/${id}/`, observation);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
