import api from "@/apis/axios";

export const deleteObservation = async (observationIds: number[]) => {
  try {
    const response = await api.delete("/api/observations/", {
      data: { observation_ids: observationIds },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting observations:", error);
    throw error;
  }
};
