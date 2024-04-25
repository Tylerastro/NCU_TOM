import { Target } from "../models/targets";
import api from "./wrapper";

export async function fetchTargets(targetId?: number): Promise<Target[]> {
  try {
    let url = "/api/targets/";

    if (targetId) {
      url += `?target_id=${encodeURIComponent(targetId)}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createTarget(newTarget: Target) {
  try {
    const response = await api.post("/api/targets/", newTarget);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function bulkCreate(file: FormData) {
  try {
    const response = await api.post("/api/targets/bulk/", file);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTarget(id: number) {
  try {
    const response = await api.post(`/api/targets/${id}/delete/`, {});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteBulkTarget(target_ids: number[]) {
  try {
    const response = await api.post("/api/targets/bulk/delete/", {
      target_ids: target_ids,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMoonAltAz(start_time: string, end_time: string) {
  try {
    const response = await api.post("/api/targets/moon/altaz/", {
      start_time: start_time,
      end_time: end_time,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTargetSimbad(target_id: number) {
  try {
    const response = await api.get("/api/targets/" + target_id + "/simbad");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTargetSED(target_id: number) {
  try {
    const response = await api.get("/api/targets/" + target_id + "/sed/");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
