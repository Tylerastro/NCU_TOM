import api from "@/apis/axios";

export const editUser = async (
  userID: number,
  role?: number,
  is_active?: boolean
) => {
  try {
    const response = await api.put(`/api/user/${userID}/`, {
      role: role,
      is_active: is_active,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
