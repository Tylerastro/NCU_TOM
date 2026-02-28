"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTargets,
  getTarget,
  createTarget,
  putTarget,
  deleteTarget,
  deleteTargets,
  bulkCreate,
  getTargetSimbad,
  getTargetSED,
  getMoonAltAz,
  resolveTargetUrl,
} from "@/apis/targets";
import { handleApiError } from "@/lib/utils/error";
import type { Target, PutTarget } from "@/types";

export const TARGET_QUERY_KEYS = {
  all: ["targets"] as const,
  lists: () => [...TARGET_QUERY_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...TARGET_QUERY_KEYS.lists(), filters] as const,
  details: () => [...TARGET_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...TARGET_QUERY_KEYS.details(), id] as const,
  simbad: (id: number) => [...TARGET_QUERY_KEYS.all, "simbad", id] as const,
  sed: (id: number) => [...TARGET_QUERY_KEYS.all, "sed", id] as const,
  moonAltAz: (start: Date, end: Date) =>
    [...TARGET_QUERY_KEYS.all, "moonAltAz", start, end] as const,
};

interface UseTargetsParams {
  page?: number;
  pageSize?: number;
  name?: string;
  enabled?: boolean;
}

/**
 * Hook for fetching paginated targets list
 */
export function useTargets({
  page = 1,
  pageSize,
  name,
  enabled = true,
}: UseTargetsParams = {}) {
  return useQuery({
    queryKey: TARGET_QUERY_KEYS.list({ page, pageSize, name }),
    queryFn: () => getTargets({ page, pageSize, name }),
    enabled,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single target
 */
export function useTarget(id: number, enabled = true) {
  return useQuery({
    queryKey: TARGET_QUERY_KEYS.detail(id),
    queryFn: () => getTarget(id),
    enabled: enabled && id > 0,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching target SIMBAD data
 */
export function useTargetSimbad(id: number, enabled = true) {
  return useQuery({
    queryKey: TARGET_QUERY_KEYS.simbad(id),
    queryFn: () => getTargetSimbad(id),
    enabled: enabled && id > 0,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching target SED data
 */
export function useTargetSED(id: number, enabled = true) {
  return useQuery({
    queryKey: TARGET_QUERY_KEYS.sed(id),
    queryFn: () => getTargetSED(id),
    enabled: enabled && id > 0,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching moon alt/az data
 */
export function useMoonAltAz(startDate: Date, endDate: Date, enabled = true) {
  return useQuery({
    queryKey: TARGET_QUERY_KEYS.moonAltAz(startDate, endDate),
    queryFn: () => getMoonAltAz(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for creating a new target
 */
export function useCreateTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Target) => createTarget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TARGET_QUERY_KEYS.all });
      toast.success("Target created successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to create target");
    },
  });
}

/**
 * Hook for bulk creating targets from file
 */
export function useBulkCreateTargets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => bulkCreate(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TARGET_QUERY_KEYS.all });
      toast.success("Targets created successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to create targets");
    },
  });
}

/**
 * Hook for updating a target
 */
export function useUpdateTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PutTarget }) =>
      putTarget(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: TARGET_QUERY_KEYS.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: TARGET_QUERY_KEYS.lists() });
      toast.success("Target updated successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to update target");
    },
  });
}

/**
 * Hook for deleting a single target
 */
export function useDeleteTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTarget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TARGET_QUERY_KEYS.all });
      toast.success("Target deleted successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to delete target");
    },
  });
}

/**
 * Hook for resolving a target from an external URL (e.g. SIMBAD)
 */
export function useResolveTargetUrl() {
  return useMutation({
    mutationFn: (url: string) => resolveTargetUrl(url),
    onError: (error: unknown) => {
      handleApiError(error, "Failed to resolve target from URL");
    },
  });
}

/**
 * Hook for deleting multiple targets
 */
export function useDeleteTargets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteTargets(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TARGET_QUERY_KEYS.all });
      toast.success("Targets deleted successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to delete targets");
    },
  });
}
