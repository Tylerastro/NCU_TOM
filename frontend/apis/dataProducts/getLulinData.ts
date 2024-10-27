import api from "@/apis/axios";

import { LulinDataProduct } from "@/models/observations";

export const getLulinData = async (): Promise<LulinDataProduct[]> => {
  try {
    const response = await api.get(`/api/data-products/lulin/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
