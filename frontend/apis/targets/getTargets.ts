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
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/targets/`);
    const params = new URLSearchParams();

    if (page) {
      params.append("page", page.toString());
    }
    if (name) {
      params.append("name", name);
    }
    if (tags && tags.length > 0) {
      params.append("tags", tags.join(","));
    }
    if (pageSize) {
      params.append("page_size", pageSize.toString());
    }

    url.search = params.toString();
    const response = await api.get(url.toString());
    return response.data;
  } catch (error) {
    throw error;
  }
};
