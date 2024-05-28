import { Announcements } from "@/models/helpers";
import api from "../axios";

export async function getAnnouncements(): Promise<Announcements[]> {
  try {
    const response = await api.get("/api/announcements/");
    return response.data;
  } catch (error) {
    throw error;
  }
}
