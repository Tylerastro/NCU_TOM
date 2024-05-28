import api from "../axiosAuth";

export const deleteBulkTarget = async (target_ids: number[]) => {
  try {
    const response = await api.post("/api/targets/bulk/delete/", {
      target_ids: target_ids,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
