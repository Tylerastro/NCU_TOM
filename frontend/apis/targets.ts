import { api } from "./lib/client";
import { buildQueryParams } from "./lib/utils";
import type { Paginator, Target, SimpleTarget, PutTarget, TargetSimbad, TargetSED } from "@/types";

// ============================================================================
// Targets CRUD
// ============================================================================

interface GetTargetsOptions {
  page?: number;
  pageSize?: number;
  name?: string;
  raMin?: number;
  raMax?: number;
  decMin?: number;
  decMax?: number;
}

export async function getTargets({
  page,
  pageSize,
  name,
  raMin,
  raMax,
  decMin,
  decMax,
}: GetTargetsOptions): Promise<Paginator<Target>> {
  const params = buildQueryParams({
    page,
    page_size: pageSize,
    name,
    ra_min: raMin,
    ra_max: raMax,
    dec_min: decMin,
    dec_max: decMax,
  });

  const response = await api.get("/api/targets/", { params });
  return response.data;
}

export async function getTarget(targetId: number): Promise<Target> {
  const response = await api.get(`/api/targets/${targetId}`);
  return response.data;
}

export async function createTarget(newTarget: Target): Promise<Target> {
  const response = await api.post("/api/targets/", newTarget);
  return response.data;
}

export async function putTarget(
  targetId: number,
  target: PutTarget
): Promise<Target> {
  const response = await api.put(`/api/targets/${targetId}/`, target);
  return response.data;
}

export async function deleteTarget(targetId: number) {
  const response = await api.delete(`/api/targets/${targetId}`);
  return response.data;
}

export async function deleteTargets(targetIds: number[]) {
  const response = await api.delete("/api/targets/", {
    data: { target_ids: targetIds },
  });
  return response.data;
}

// ============================================================================
// Bulk Operations
// ============================================================================

export async function bulkCreate(file: FormData) {
  const response = await api.post("/api/targets/bulk/", file);
  return response.data;
}

// ============================================================================
// External Data (Simbad, SED)
// ============================================================================

export async function getTargetSimbad(
  targetId: number
): Promise<TargetSimbad> {
  const response = await api.get(`/api/targets/${targetId}/simbad`);
  return response.data;
}

export async function getTargetSED(targetId: number): Promise<TargetSED> {
  const response = await api.get(`/api/targets/${targetId}/sed/`);
  return response.data;
}

// ============================================================================
// URL Resolution
// ============================================================================

export interface ResolvedTarget {
  name: string;
  ra: number;
  dec: number;
  source: string;
}

export async function resolveTargetUrl(url: string): Promise<ResolvedTarget> {
  const response = await api.post("/api/targets/query/", { url });
  return response.data;
}

// ============================================================================
// Astronomical Calculations
// ============================================================================

export async function getMoonAltAz(startTime: Date, endTime: Date) {
  const response = await api.post("/api/targets/moon/altaz/", {
    start_time: startTime,
    end_time: endTime,
  });
  return response.data;
}
