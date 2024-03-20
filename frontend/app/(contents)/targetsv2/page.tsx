"use client";
import { columns } from "./columns";
import { Target } from "@/models/targets";
import { DataTable } from "./dataTable";
import { fetchTargets } from "@/apis/targets";
import * as React from "react";

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
      <div className="flex space-between pb-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
          Targets
        </h1>
      </div>

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
