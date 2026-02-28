import { api } from "./lib/client";
import { Tag, NewTag } from "@/models/helpers";

export async function getTags(): Promise<Tag[]> {
  const response = await api.get("/api/tags/");
  return response.data;
}

export async function createNewTag(tag: NewTag): Promise<Tag> {
  const response = await api.post("/api/tags/", tag);
  return response.data;
}
