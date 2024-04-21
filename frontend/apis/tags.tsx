import { NewTag } from "@/models/helpers";
import api from "./wrapper";

export async function fetchTags() {
  try {
    const response = await api.get("/api/tags/");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function postNewTag(tag: NewTag) {
  try {
    const response = await api.post("/api/tags/", tag);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
