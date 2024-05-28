import api from "../axiosAuth";

export const bulkCreate = async (file: FormData) => {
  try {
    const response = await api.post("/api/targets/bulk/", file);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
