import { api } from "./lib/client";
import { Announcements } from "@/models/helpers";

export async function getAnnouncements(): Promise<Announcements[]> {
  const response = await api.get("/api/announcements/");
  return response.data;
}

export async function createAnnouncement(
  newAnnouncement: Announcements
): Promise<Announcements> {
  const response = await api.post("/api/announcements/", newAnnouncement);
  return response.data;
}
