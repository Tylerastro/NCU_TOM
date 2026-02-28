import { api } from "./lib/client";
import { UserProfile } from "@/models/users";

export async function getUserList(): Promise<UserProfile[]> {
  const response = await api.get("/api/users/");
  return response.data;
}

export async function editUser(
  userId: number,
  role?: number,
  isActive?: boolean
): Promise<UserProfile> {
  const response = await api.put(`/api/user/${userId}/`, {
    role,
    is_active: isActive,
  });
  return response.data;
}
