import api from "../axiosAuth";

export const getUserList = async () => {
  try {
    const response = await api.get("/api/list/users/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
