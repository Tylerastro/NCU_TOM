"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getObservations,
  getObservation,
  createObservation,
  putObservation,
  deleteObservation,
  getObservationStats,
  getObservationAltAz,
} from "@/apis/observations";
import { handleApiError } from "@/lib/utils/error";
import type { NewObservation, ObservationUpdate } from "@/types";

export const OBSERVATION_QUERY_KEYS = {
  all: ["observations"] as const,
  lists: () => [...OBSERVATION_QUERY_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...OBSERVATION_QUERY_KEYS.lists(), filters] as const,
  details: () => [...OBSERVATION_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...OBSERVATION_QUERY_KEYS.details(), id] as const,
  stats: () => [...OBSERVATION_QUERY_KEYS.all, "stats"] as const,
  altAz: (id: number) => [...OBSERVATION_QUERY_KEYS.all, "altaz", id] as const,
};

interface UseObservationsParams {
  page?: number;
  name?: string;
  users?: number[];
  status?: number[];
  enabled?: boolean;
}

/**
 * Hook for fetching paginated observations list
 */
export function useObservations({
  page = 1,
  name,
  users,
  status,
  enabled = true,
}: UseObservationsParams = {}) {
  return useQuery({
    queryKey: OBSERVATION_QUERY_KEYS.list({ page, name, users, status }),
    queryFn: () => getObservations({ page, name, users, status }),
    enabled,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single observation
 */
export function useObservation(id: number, enabled = true) {
  return useQuery({
    queryKey: OBSERVATION_QUERY_KEYS.detail(id),
    queryFn: () => getObservation(id),
    enabled: enabled && id > 0,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching observation statistics
 */
export function useObservationStats(enabled = true) {
  return useQuery({
    queryKey: OBSERVATION_QUERY_KEYS.stats(),
    queryFn: getObservationStats,
    enabled,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching observation alt/az data
 */
export function useObservationAltAz(id: number, enabled = true) {
  return useQuery({
    queryKey: OBSERVATION_QUERY_KEYS.altAz(id),
    queryFn: () => getObservationAltAz(id),
    enabled: enabled && id > 0,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for creating a new observation
 */
export function useCreateObservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewObservation) => createObservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBSERVATION_QUERY_KEYS.all });
      toast.success("Observation created successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to create observation");
    },
  });
}

/**
 * Hook for updating an observation
 */
export function useUpdateObservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ObservationUpdate }) =>
      putObservation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: OBSERVATION_QUERY_KEYS.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: OBSERVATION_QUERY_KEYS.lists() });
      toast.success("Observation updated successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to update observation");
    },
  });
}

/**
 * Hook for deleting observations
 */
export function useDeleteObservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteObservation(ids),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: OBSERVATION_QUERY_KEYS.all });
      toast.success(
        (response as { message?: string }).message ||
          "Observations deleted successfully"
      );
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to delete observations");
    },
  });
}
