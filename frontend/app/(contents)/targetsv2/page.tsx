"use client";
import { deleteBulkTarget, fetchTargets } from "@/apis/targets";
import { Target } from "@/models/targets";
import * as React from "react";
import { columns } from "./columns";
import { NewTargetFrom } from "./createTargets";
import { DataTable } from "./dataTable";

export default function TargetsTable() {
  const [data, setData] = React.useState<Target[]>([]);
  React.useEffect(() => {
    fetchTargets()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDelete = async (ids: number[]) => {
    try {
      await deleteBulkTarget(ids);

      const updatedData = data.filter(
        (target) => target.id !== undefined && !ids.includes(target.id)
      );

      setData(updatedData);
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
          <NewTargetFrom />
        </div>
      </div>

      <div className="container px-0 sm:max-w-[825px] lg:max-w-full  py-10">
        <DataTable columns={columns} data={data} onDelete={handleDelete} />
      </div>
    </>
  );
}
