"use client";
import { getObservations } from "@/apis/observations/getObservations";
import { Skeleton } from "@/components/ui/skeleton";
import { Observation } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteObservation } from "@/apis/observations/deleteObservation";
import { columns } from "./columns";
import { NewObservationFrom } from "./createObservation";
import { Button } from "@/components/ui/button";
import { DataTable } from "./dataTable";
import { useState } from "react";
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

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleDelete = async (ids: number[]) => {
    try {
      const response = await deleteObservation(ids);
      await refetch();
      toast.success(response.message || "Observations deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

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
          <Button
            variant="outline"
            size={"lg"}
            disabled={selectedIds.length === 0}
            className=" dark:bg-red-800/100 dark:hover:bg-red-500/70"
            onClick={() => handleDelete(selectedIds.map((id) => id))}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="container px-0 sm:max-w-[825px] lg:max-w-full  py-10">
        {isFetching ? (
          <LoadingSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={observations}
            setSelectedIds={setSelectedIds}
          />
        )}
      </div>
    </>
  );
}
