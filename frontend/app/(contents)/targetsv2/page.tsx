"use client";
import TargetApis from "@/apis/targets";
import { Target } from "@/models/targets";
import * as React from "react";
import { columns } from "./columns";
import { NewTargetFrom } from "./createTargets";
import { DataTable } from "./dataTable";
import { useQuery } from "@tanstack/react-query";

export default function TargetsTable() {
  const { fetchTargets, deleteBulkTarget } = TargetApis();
  const { data: targets, refetch } = useQuery({
    queryKey: ["targets"],
    queryFn: () => fetchTargets(),
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
        <DataTable columns={columns} data={targets} onDelete={handleDelete} />
      </div>
    </>
  );
}
