import api from "../axiosAuth";

export const deleteUser = async (userId: number) => {
  try {
    const response = await api.delete("/api/user/" + userId + "/delete/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
