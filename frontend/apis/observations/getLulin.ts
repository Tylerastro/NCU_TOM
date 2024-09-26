import api from "@/apis/axios";

import { LulinRuns } from "@/models/observations";

export const getLulin = async (id: number): Promise<LulinRuns[]> => {
  try {
    const response = await api.get(`/api/observations/${id}/lulin/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
