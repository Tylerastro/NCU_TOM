"use client";
import { getObservations } from "@/apis/observations/getObservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Status } from "@/models/enums";
import { useQuery } from "@tanstack/react-query";
import ObservationTable from "./observationTable";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-3 py-10">
      <div className="space-y-4">
        <Skeleton className="h-4 w-8/12" />
        <Skeleton className="h-4 w-6/12" />
        <Skeleton className="h-4 w-4/12" />
        <Skeleton className="h-4 w-2/12" />
      </div>
    </div>
  );
}

export default function ObservationMonitor() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["observations"],
    queryFn: () =>
      getObservations({
        pageSize: 50,
        status: [Status.Pending, Status.In_progress, Status.Done],
      }),
    refetchOnWindowFocus: true,
  });

  const observations = data?.results || [];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Complete Observations
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0000</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Proposals
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending observations
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Postponed observations
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="py-7 grid gap-4 grid-cols-3">
        <div>
          <span>Pending</span>
          {isFetching ? (
            <LoadingSkeleton />
          ) : (
            <ObservationTable
              observationData={observations.filter(
                (o) => o.status === Status.Pending
              )}
            />
          )}
        </div>
        <div>
          <span className="text-lg">In progress</span>
          {isFetching ? (
            <LoadingSkeleton />
          ) : (
            <ObservationTable
              observationData={observations.filter(
                (o) => o.status === Status.In_progress
              )}
            />
          )}
        </div>
        <div>
          <span className="text-lg">Completed</span>
          {isFetching ? (
            <LoadingSkeleton />
          ) : (
            <ObservationTable
              observationData={observations.filter(
                (o) => o.status === Status.Done
              )}
            />
          )}
        </div>
      </div>
    </>
  );
}
