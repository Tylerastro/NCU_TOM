import api from "@/apis/axios";

export const deleteLulin = async (pk: number) => {
  try {
    const response = await api.delete(`/api/observations/lulin/${pk}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
