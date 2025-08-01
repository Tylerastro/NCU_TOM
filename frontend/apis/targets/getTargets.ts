import { Paginator } from "@/models/helpers";
import api from "@/apis/axios";

interface GetTargetsOptions {
  page?: number;
  pageSize?: number;
  name?: string;
  tags?: number[];
}

export const getTargets = async ({
  page,
  pageSize,
  name,
  tags,
}: GetTargetsOptions): Promise<Paginator> => {
  try {
    const params: Record<string, string> = {};

    if (page) {
      params.page = page.toString();
    }
    if (name) {
      params.name = name;
    }
    if (tags && tags.length > 0) {
      params.tags = tags.join(",");
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
