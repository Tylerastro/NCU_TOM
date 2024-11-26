import api from "@/apis/axios";

interface getAlertOptions {
  page?: number;
  pageSize?: number;
  name?: string;
  tags?: number[];
}
export const getAlerts = async ({
  page,
  pageSize,
  name,
  tags,
}: getAlertOptions) => {
  try {
    const response = await api.get(``);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
