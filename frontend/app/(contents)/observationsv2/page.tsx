"use client";
import { getObservations } from "@/apis/observations";
import { Observation } from "@/models/observations";
import * as React from "react";
import { columns } from "./columns";
import { NewTargetFrom } from "./createTargets";
import { DataTable } from "./dataTable";

export default function ObservationsTable() {
  const [data, setData] = React.useState<Observation[]>([]);
  React.useEffect(() => {
    getObservations()
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
            Observations
          </h1>
        </div>

        <div className="flex gap-2">
          <NewTargetFrom />
        </div>
      </div>

      <div className="container px-0 sm:max-w-[825px] lg:max-w-full  py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
