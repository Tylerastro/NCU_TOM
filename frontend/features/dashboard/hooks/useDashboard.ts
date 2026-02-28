"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUserList, editUser } from "@/apis/system";
import { getETLLogs } from "@/apis/logs";
import { handleApiError } from "@/lib/utils/error";
import type { UserRole } from "@/types";

export const DASHBOARD_QUERY_KEYS = {
  users: ["dashboard", "users"] as const,
  etlLogs: ["dashboard", "etl-logs"] as const,
};

/**
 * Hook for fetching all users (admin only)
 */
export function useUserList(enabled = true) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.users,
    queryFn: getUserList,
    enabled,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for editing a user's role (admin only)
 */
export function useEditUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: number }) =>
      editUser(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.users });
      toast.success("User role updated successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to update user role");
    },
  });
}

/**
 * Hook for fetching ETL logs
 */
export function useETLLogs(enabled = true) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.etlLogs,
    queryFn: getETLLogs,
    enabled,
    refetchOnWindowFocus: false,
  });
}
