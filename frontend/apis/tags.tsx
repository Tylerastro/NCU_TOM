import { Tag } from "@/models/helpers";

export async function fetchTags() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tags`,
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
    const data: Tag[] = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
