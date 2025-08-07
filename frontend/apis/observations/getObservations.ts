import api from "@/apis/axios";

import { Paginator } from "@/models/helpers";

interface GetObservationsOptions {
  name?: string;
  page?: number;
  pageSize?: number;
  users?: number[];
  status?: number[];
}

export const getObservations = async ({
  name,
  page,
  pageSize,
  users,
  status,
}: GetObservationsOptions): Promise<Paginator> => {
  try {
    const params: Record<string, string> = {};

    if (name) {
      params.name = name;
    }
    if (page !== undefined) {
      params.page = page.toString();
    }
    if (pageSize !== undefined) {
      params.page_size = pageSize.toString();
    }
    if (users && users.length > 0) {
      params.users = users.join(",");
    }
    if (status && status.length > 0) {
      params.status = status.join(",");
    }

    const response = await api.get("/api/observations/", { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
