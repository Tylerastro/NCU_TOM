import api from "../axiosAuth";

export const deleteTarget = async (targetIds: number[]) => {
  try {
    const response = await api.delete("/api/targets/delete/", {
      data: { target_ids: targetIds },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting targets:", error);
    throw error;
  }
};
