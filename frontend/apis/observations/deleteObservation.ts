import api from "../axiosAuth";

export const deleteObservation = async (id: number) => {
  try {
    const response = await api.post("/api/observations/" + id + "/delete/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
