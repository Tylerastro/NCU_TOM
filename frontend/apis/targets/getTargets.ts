import { Paginator } from "@/models/helpers";
import api from "../axiosAuth";

export const getTargets = async (
  page?: number,
  name?: string
): Promise<Paginator> => {
  try {
    let url = "/api/targets/";
    if (page) {
      url += `?page=${page}`;
    }
    if (name) {
      url += `&name=${name}`;
    }
    const response = await api.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
