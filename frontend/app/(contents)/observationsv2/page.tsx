"use client";
import ObservationApis from "@/apis/observations";
import { Observation } from "@/models/observations";
import * as React from "react";
import { columns } from "./columns";
import { NewObservationFrom } from "./createObservation";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./dataTable";

export default function ObservationsTable() {
  const { getObservations } = ObservationApis();
  const { data: observations, refetch } = useQuery({
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
        <DataTable columns={columns} data={observations} />
      </div>
    </>
  );
}
