"use client";
import { fetchTargets } from "@/apis/targets";
import { Button } from "@/components/ui/button";
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

          <Button
            color={"secondary"}
            size={"lg"}
            variant={"outline"}
            className="hover:bg-red-500 hover:border-red-500"
          >
            Delete targets
          </Button>
        </div>
      </div>

      <div className="container  sm:max-w-[825px] lg:max-w-full  py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
