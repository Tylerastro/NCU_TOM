import api from "@/apis/axios";

export const saveLulinCode = async (id: number, code: string) => {
  try {
    const response = await api.put(`/api/observations/${id}/lulin/code/`, {
      code: code
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};