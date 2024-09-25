import { NewObservation } from "@/models/observations";
import api from "@/apis/axios";

export const createObservation = async (newObservation: NewObservation) => {
  try {
    const response = await api.post("/api/observations/", newObservation);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
