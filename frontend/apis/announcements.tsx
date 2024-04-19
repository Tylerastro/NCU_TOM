import { Announcements } from "@/models/helpers";

export async function fetchAnnouncements() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/announcements/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: Announcements[] = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createAnnouncement(newAnnouncement: Announcements) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/announcements/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnnouncement),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
}
