import api from "@/apis/axios";

export const deleteAlert = async (id: number[]) => {
  try {
    const response = await api.post(``, { ids: id });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
