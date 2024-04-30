import {
  LulinObservations,
  LulinObservationsUpdate,
  NewObservation,
  ObservationUpdate,
} from "@/models/observations";

import api from "./wrapper";

export async function createObservation(newObservation: NewObservation) {
  try {
    const response = await api.post("/api/observations/", newObservation);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function putObservation(
  id: number,
  observation: ObservationUpdate
) {
  try {
    const response = await api.put(
      `/api/observations/${id}/edit/`,
      observation
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteObservation(id: number) {
  try {
    const response = await api.post("/api/observations/" + id + "/delete/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getObservations(observationId?: number) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/observations/`;
    if (observationId) {
      url += `?observation_id=${observationId}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLulin(id: number): Promise<LulinObservations[]> {
  try {
    const response = await api.get(`/api/observations/${id}/lulin/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function putLulin(
  pk: number,
  updateData: LulinObservationsUpdate
) {
  try {
    const response = await api.put(
      `/api/observations/${pk}/lulin/`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLulinCode(id: number, refresh: boolean = false) {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/lulin/${id}/code/`
    );
    url.searchParams.append("refresh", refresh ? "true" : "false");
    const response = await api.get(url.toString());
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getObservationAltAz(
  id: number,
  start_time: string,
  end_time: string
) {
  try {
    const response = await api.post("/api/observations/" + id + "/altaz/", {
      start_time: start_time,
      end_time: end_time,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function postObservationMessages(id: number, message: string) {
  try {
    const response = await api.post(
      "/api/observations/" + id + "/messages/",
      message
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
