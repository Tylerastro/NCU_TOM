import { Paginator } from "@/models/helpers";
import api from "@/apis/axios";

interface GetTargetsOptions {
  page?: number;
  pageSize?: number;
  name?: string;
}

export const getTargets = async ({
  page,
  pageSize,
  name,
}: GetTargetsOptions): Promise<Paginator> => {
  try {
    const params: Record<string, string> = {};

    if (page) {
      params.page = page.toString();
    }
    if (name) {
      params.name = name;
    }
    if (pageSize) {
      params.page_size = pageSize.toString();
    }

    const response = await api.get("/api/targets/", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
