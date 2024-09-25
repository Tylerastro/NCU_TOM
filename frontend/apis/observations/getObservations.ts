import api from "@/apis/axios";

import { Paginator } from "@/models/helpers";

interface GetObservationsOptions {
  name?: string;
  page?: number;
  pageSize?: number;
  tags?: number[];
  users?: number[];
  status?: number[];
}

export const getObservations = async ({
  name,
  page,
  pageSize,
  tags,
  users,
  status,
}: GetObservationsOptions): Promise<Paginator> => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/observations/`);
    const params = new URLSearchParams();

    if (name) {
      params.append("name", name);
    }
    if (page !== undefined) {
      params.append("page", page.toString());
    }
    if (pageSize !== undefined) {
      params.append("page_size", pageSize.toString());
    }
    if (tags && tags.length > 0) {
      params.append("tags", tags.join(","));
    }
    if (users && users.length > 0) {
      params.append("users", users.join(","));
    }
    if (status && status.length > 0) {
      params.append("status", status.join(","));
    }

    url.search = params.toString();

    const response = await api.get(url.toString());
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
