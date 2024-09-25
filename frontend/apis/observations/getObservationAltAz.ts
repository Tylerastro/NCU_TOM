import api from "@/apis/axios";

export const getObservationAltAz = async (id: number) => {
  try {
    const response = await api.post("/api/observations/" + id + "/altaz/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
