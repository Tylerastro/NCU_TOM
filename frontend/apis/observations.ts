import { api } from "./lib/client";
import { buildQueryParams } from "./lib/utils";
import type { Paginator } from "@/types";
import type {
  Observation,
  NewObservation,
  ObservationUpdate,
  ObservationStats,
  LulinRuns,
  LulinRunUpdate,
  LulinObservationsCreate,
} from "@/types";
import { format, toZonedTime } from "date-fns-tz";
import { addDays } from "date-fns";

// ============================================================================
// Observations CRUD
// ============================================================================

interface GetObservationsOptions {
  name?: string;
  page?: number;
  pageSize?: number;
  users?: number[];
  status?: number[];
}

export async function getObservations({
  name,
  page,
  pageSize,
  users,
  status,
}: GetObservationsOptions): Promise<Paginator<Observation>> {
  const params = buildQueryParams({
    name,
    page,
    page_size: pageSize,
    users,
    status,
  });

  const response = await api.get("/api/observations/", { params });
  return response.data;
}

export async function getObservation(
  observationId: number
): Promise<Observation> {
  const response = await api.get(`/api/observations/${observationId}`);
  return response.data;
}

export async function createObservation(
  newObservation: NewObservation
): Promise<Observation> {
  const response = await api.post("/api/observations/", newObservation);
  return response.data;
}

export async function putObservation(
  id: number,
  observation: ObservationUpdate
): Promise<Observation> {
  const response = await api.put(`/api/observations/${id}/`, observation);
  return response.data;
}

export async function deleteObservation(observationIds: number[]) {
  const response = await api.delete("/api/observations/", {
    data: { observation_ids: observationIds },
  });
  return response.data;
}

export async function duplicateObservation(pk: number) {
  const response = await api.post(`/api/observations/${pk}/duplicate/`);
  return response.data;
}

// ============================================================================
// Observation Stats & Alt/Az
// ============================================================================

export async function getObservationStats(): Promise<ObservationStats> {
  const response = await api.get("/api/observations/stats/");
  return response.data;
}

export async function getObservationAltAz(id: number) {
  const response = await api.post(`/api/observations/${id}/altaz/`);
  return response.data;
}

// ============================================================================
// Lulin Runs
// ============================================================================

export async function getLulin(id: number): Promise<LulinRuns[]> {
  const response = await api.get(`/api/observations/${id}/lulin/`);
  return response.data;
}

export async function createLulin(pk: number, data: LulinObservationsCreate) {
  const response = await api.post(`/api/observations/${pk}/lulin/`, data);
  return response.data;
}

export async function putLulinRun(pk: number, updateData: LulinRunUpdate) {
  const response = await api.put(`/api/observations/lulin/${pk}/`, updateData);
  return response.data;
}

export async function deleteLulin(pk: number) {
  const response = await api.delete(`/api/observations/lulin/${pk}/`);
  return response.data;
}

// ============================================================================
// Lulin Code
// ============================================================================

export async function getLulinCode(id: number, refresh: boolean = false) {
  const response = await api.get(`/api/observations/${id}/lulin/code/`, {
    params: { refresh: refresh ? "true" : "false" },
  });
  return response.data;
}

export async function saveLulinCode(id: number, code: string) {
  const response = await api.put(`/api/observations/${id}/lulin/code/`, {
    code: code,
  });
  return response.data;
}

export async function getCodePreview(date: Date) {
  const start_date = toZonedTime(
    new Date(format(date, "yyyy-MM-dd" + " 18:00:00")),
    "Asia/Taipei"
  );
  const end_date = toZonedTime(
    new Date(format(addDays(date, 1), "yyyy-MM-dd" + " 08:00:00")),
    "Asia/Taipei"
  );

  const response = await api.get("/api/observations/lulin/code/", {
    params: { start_date, end_date },
  });
  return response.data;
}

// ============================================================================
// Messages & Comments
// ============================================================================

export async function postObservationMessages(id: number, message: string) {
  const response = await api.post(`/api/observations/${id}/messages/`, message);
  return response.data;
}

export async function deleteComment(commentId: number) {
  const response = await api.delete(`/api/comments/${commentId}/`);
  return response.data;
}
