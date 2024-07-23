import api from "../axiosAuth";

export const deleteTarget = async (targetId: number) => {
  try {
    const response = await api.delete("/api/targets/" + targetId);
    return response.data;
  } catch (error) {
    console.error("Error deleting targets:", error);
    throw error;
  }
};
