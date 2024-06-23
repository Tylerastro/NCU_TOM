import { Paginator } from "@/models/helpers";
import api from "../axiosAuth";

export const getTargets = async (
  page?: number,
  name?: string,
  tags?: number[]
): Promise<Paginator> => {
  try {
    let url = "/api/targets/";
    if (page) {
      url += `?page=${page}`;
    }
    if (name) {
      url += `&name=${name}`;
    }
    if (tags && tags.length > 0) {
      url += `&tags=${tags.join(",")}`;
    }
    const response = await api.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
