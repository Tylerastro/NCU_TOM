"use client";
import { deleteBulkTarget } from "@/apis/targets/bulkTargetDelete";
import { getTargets } from "@/apis/targets/getTargets";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "@/models/targets";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { NewTargetFrom } from "./createTargets";
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

export default function TargetsTable() {
  const {
    data: targets,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["targets"],
    queryFn: () => getTargets(),
    refetchOnWindowFocus: false,
    initialData: () => [] as Target[],
  });

  const handleDelete = async (ids: number[]) => {
    try {
      await deleteBulkTarget(ids);
      await refetch();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <>
      <div className="flex space-between justify-between pb-2">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            Targets
          </h1>
        </div>

        <div className="flex gap-2">
          <NewTargetFrom refetch={refetch} />
        </div>
      </div>

      <div className="container px-0 sm:max-w-[825px] lg:max-w-full  py-10">
        {isFetching ? (
          <LoadingSkeleton />
        ) : (
          <DataTable columns={columns} data={targets} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
}
