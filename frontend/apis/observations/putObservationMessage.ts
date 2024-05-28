import api from "../axiosAuth";

export const postObservationMessages = async (id: number, message: string) => {
  try {
    const response = await api.post(
      "/api/observations/" + id + "/messages/",
      message
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
