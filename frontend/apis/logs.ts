import { api } from "./lib/client";
import { ETLLogs } from "@/models/helpers";

export async function getETLLogs(): Promise<ETLLogs[]> {
  const response = await api.get("/api/logs/ETL/");
  return response.data;
}
