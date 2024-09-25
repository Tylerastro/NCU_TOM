import api from "@/apis/axios";

export const getTargetSimbad = async (target_id: number) => {
  try {
    const response = await api.get("/api/targets/" + target_id + "/simbad");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
