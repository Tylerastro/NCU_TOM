import api from "@/apis/axios";

export const duplicateObservation = async (pk: number) => {
  try {
    const response = await api.post(`/api/observations/${pk}/duplicate/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting observations:", error);
    throw error;
  }
};
