import api from "@/apis/axios";

export const getLulinCode = async (id: number, refresh: boolean = false) => {
  try {
    const response = await api.get(`/api/observations/${id}/lulin/code/`, {
      params: {
        refresh: refresh ? "true" : "false"
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
