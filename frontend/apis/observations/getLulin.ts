import api from "@/apis/axios";

import { LulinObservations } from "@/models/observations";

export const getLulin = async (id: number): Promise<LulinObservations[]> => {
  try {
    const response = await api.get(`/api/observations/${id}/lulin/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
