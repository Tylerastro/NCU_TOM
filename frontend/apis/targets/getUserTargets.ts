import api from "../axiosAuth";
import { Target } from "@/models/targets";

export const getUserTargets = async (): Promise<Target[]> => {
  try {
    let url = "/api/targets/";
    const response = await api.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
