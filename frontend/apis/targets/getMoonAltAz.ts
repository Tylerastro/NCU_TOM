import api from "@/apis/axios";

export const getMoonAltAz = async (start_time: Date, end_time: Date) => {
  try {
    const response = await api.post("/api/targets/moon/altaz/", {
      start_time: start_time,
      end_time: end_time,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
