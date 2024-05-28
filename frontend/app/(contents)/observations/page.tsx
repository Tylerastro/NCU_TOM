"use client";
import { getObservations } from "@/apis/observations/getObservations";
import { Skeleton } from "@/components/ui/skeleton";
import { Observation } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { NewObservationFrom } from "./createObservation";
import { DataTable } from "./dataTable";
function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-3 py-10">
      <Skeleton className="h-[250px] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-8/12" />
        <Skeleton className="h-4 w-6/12" />
      </div>
    </div>
  );
}

export default function ObservationsTable() {
  const {
    data: observations,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["observations"],
    queryFn: () => getObservations(),
    initialData: () => [] as Observation[],
  });

  return (
    <>
      <div className="flex space-between justify-between pb-2">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            Observations
          </h1>
        </div>

        <div className="flex gap-2">
          <NewObservationFrom refetch={refetch} />
        </div>
      </div>

      <div className="container px-0 sm:max-w-[825px] lg:max-w-full  py-10">
        {isFetching ? (
          <LoadingSkeleton />
        ) : (
          <DataTable columns={columns} data={observations} />
        )}
      </div>
    </>
  );
}
