import api from "@/apis/axios";

export const editUserRole = async (userID: number, role: number) => {
  try {
    const response = await api.put(`/api/user/${userID}/`, {
      role: role,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
