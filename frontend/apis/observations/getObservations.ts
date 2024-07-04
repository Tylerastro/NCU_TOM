import api from "../axiosAuth";
import { Paginator } from "@/models/helpers";

interface GetObservationsOptions {
  observationId?: number;
  name?: string;
  page?: number;
  pageSize?: number;
  tags?: number[];
  user?: number[];
  status?: number[];
}

export const getObservations = async ({
  observationId,
  name,
  page,
  pageSize,
  tags,
  user,
  status,
}: GetObservationsOptions): Promise<Paginator> => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/observations/`);
    const params = new URLSearchParams();

    if (observationId !== undefined) {
      params.append("observation_id", observationId.toString());
    }
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
    if (user && user.length > 0) {
      params.append("user", user.join(","));
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
