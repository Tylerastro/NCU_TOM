import { Announcements } from "@/models/helpers";
import api from "@/apis/axios";

export const createAnnouncement = async (newAnnouncement: Announcements) => {
  try {
    const response = await api.post("/api/announcements/", newAnnouncement);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
