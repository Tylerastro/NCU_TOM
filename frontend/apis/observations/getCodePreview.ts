import api from "../axiosAuth";

export const getCodePreview = async (date: Date) => {
  const start_date = date.toISOString().split("T")[0];
  const end_date = new Date(date.getTime() + 64 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  try {
    const response = await api.get("/api/observations/lulin/code/", {
      params: {
        start_date: start_date,
        end_date: end_date,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
