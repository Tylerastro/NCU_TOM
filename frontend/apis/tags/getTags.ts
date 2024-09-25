import api from "@/apis/axios";

import { Tag } from "@/models/helpers";
export const getTags = async (): Promise<Tag[]> => {
  try {
    const response = await api.get("/api/tags/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
