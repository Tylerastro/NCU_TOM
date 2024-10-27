import { ETLLogs } from "@/models/helpers";
import api from "@/apis/axios";

export const getETLLogs = async (): Promise<ETLLogs[]> => {
  try {
    const response = await api.get("/api/logs/ETL/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
