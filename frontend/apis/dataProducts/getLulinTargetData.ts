import api from "@/apis/axios";

import { LulinDataProduct } from "@/models/observations";

export const getLulinTargetData = async (
  targetId: number
): Promise<LulinDataProduct[]> => {
  try {
    const response = await api.get(
      `/api/data-products/lulin/target/` + targetId
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
