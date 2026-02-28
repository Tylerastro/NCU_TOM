import { api } from "./lib/client";
import type { LulinDataProduct } from "@/types";

export async function getLulinData(): Promise<LulinDataProduct[]> {
  // pk=0 returns latest 15 data products within 1.5 days of latest MJD
  const response = await api.get("/api/data-products/lulin/target/0/");
  return response.data;
}

export async function getLulinTargetData(
  targetId: number
): Promise<LulinDataProduct[]> {
  const response = await api.get(`/api/data-products/lulin/target/${targetId}/`);
  return response.data;
}
