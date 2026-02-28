"use client";

import { getTargets } from "@/apis/targets";
import { getObservations } from "@/apis/observations";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Status } from "@/types/enums";
import type { UserDashboardData, UserDashboardStats } from "../components/types";

export function useUserDashboard(): UserDashboardData {
  const {
    data: targetsData,
    isLoading: targetsLoading,
    isError: targetsError,
    refetch: refetchTargets,
  } = useQuery({
    queryKey: ["user-dashboard-targets"],
    queryFn: () => getTargets({ page: 1, pageSize: 100 }),
  });

  const {
    data: observationsData,
    isLoading: observationsLoading,
    isError: observationsError,
    refetch: refetchObservations,
  } = useQuery({
    queryKey: ["user-dashboard-observations"],
    queryFn: () => getObservations({ page: 1, pageSize: 100 }),
  });

  const targets = useMemo(() => {
    return targetsData?.results ?? [];
  }, [targetsData]);

  const observations = useMemo(() => {
    return observationsData?.results ?? [];
  }, [observationsData]);

  const stats: UserDashboardStats = useMemo(() => {
    const inProgress = observations.filter(
      (obs) => obs.status === Status.In_progress
    ).length;
    const completed = observations.filter(
      (obs) => obs.status === Status.Done
    ).length;

    return {
      totalTargets: targetsData?.count ?? 0,
      totalObservations: observationsData?.count ?? 0,
      inProgress,
      completed,
    };
  }, [observations, targetsData?.count, observationsData?.count]);

  const refetch = () => {
    refetchTargets();
    refetchObservations();
  };

  return {
    targets: targets.slice(0, 5),
    observations: observations.slice(0, 5),
    stats,
    isLoading: targetsLoading || observationsLoading,
    isError: targetsError || observationsError,
    refetch,
  };
}
