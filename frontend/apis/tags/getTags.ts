import api from "../axiosAuth";

export const getTags = async () => {
  try {
    const response = await api.get("/api/tags/");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
