import api from "../axiosAuth";
import { LulinObservationsUpdate } from "@/models/observations";

export const putLulin = async (
  pk: number,
  updateData: LulinObservationsUpdate
) => {
  try {
    const response = await api.put(
      `/api/observations/${pk}/lulin/`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
