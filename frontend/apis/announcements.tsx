import { Announcements } from "@/models/helpers";
import api from "./axios";

export async function fetchAnnouncements(): Promise<Announcements[]> {
  try {
    const response = await api.get("/api/announcements/");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createAnnouncement(newAnnouncement: Announcements) {
  try {
    const response = await api.post("/api/announcements/", newAnnouncement);
    return response.data;
  } catch (error) {
    throw error;
  }
}
