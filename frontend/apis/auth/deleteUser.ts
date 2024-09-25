import api from "@/apis/axios";

export const deleteUser = async (userId: number) => {
  try {
    const response = await api.delete("/api/user/" + userId + "/delete/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
