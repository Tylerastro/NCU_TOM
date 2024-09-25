import api from "@/apis/axios";

import { NewTag } from "@/models/helpers";

export const createNewTag = async (tag: NewTag) => {
  try {
    const response = await api.post("/api/tags/", tag);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
