import api from "@/apis/axios";

import { LulinRunUpdate } from "@/models/observations";

export const putLulinRun = async (pk: number, updateData: LulinRunUpdate) => {
  try {
    const response = await api.put(
      `/api/observations/lulin/${pk}/`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
