import api from "../axiosAuth";

export const getLulinCode = async (id: number, refresh: boolean = false) => {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/${id}/lulin//code/`
    );
    url.searchParams.append("refresh", refresh ? "true" : "false");
    const response = await api.get(url.toString());
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
