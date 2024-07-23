import api from "../axiosAuth";
import { LulinObservationsUpdate } from "@/models/observations";

export const putLulin = async (
  pk: number,
  updateData: LulinObservationsUpdate
) => {
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
