import api from "../axiosAuth";
import { LulinObservationsCreate } from "@/models/observations";

export const createLulin = async (
  pk: number,
  data: LulinObservationsCreate
) => {
  try {
    const response = await api.post(`/api/observations/${pk}/lulin/`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
