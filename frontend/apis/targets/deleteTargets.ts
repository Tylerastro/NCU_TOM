import api from "@/apis/axios";

export const deleteTargets = async (targetIds: number[]) => {
  try {
    const response = await api.delete("/api/targets/", {
      data: { target_ids: targetIds },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting targets:", error);
    throw error;
  }
};
