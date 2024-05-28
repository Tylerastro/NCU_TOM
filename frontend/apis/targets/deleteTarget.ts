import api from "../axiosAuth";

export const deleteTarget = async (id: number) => {
  try {
    const response = await api.post(`/api/targets/${id}/delete/`, {});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
