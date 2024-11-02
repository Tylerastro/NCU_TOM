"use client";
import { getLulin } from "@/apis/observations/getLulin";
import { getObservation } from "@/apis/observations/getObservation";
import VisibilityChart from "@/components/observations/VisibilityPlot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { LulinRuns, Observation } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CodeBlock from "./codeblock";
import LulinData from "./lulinData";
import { NewLulinRun } from "./newlulinForm";
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

export default function LulinPage(props: { observation_id: number }) {
  const [codeUpdate, setCodeUpdate] = useState(false);

  const { data: observation, isFetching: observationIsFetching } = useQuery({
    queryKey: ["getObservation", props.observation_id],
    queryFn: () =>
      getObservation(props.observation_id).then((data) => {
        return data;
      }),
    initialData: {} as Observation,
  });

  const {
    data: lulinObservations,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["getLulin"],
    queryFn: () =>
      getLulin(props.observation_id).then((data) => {
        return data;
      }),
    initialData: [] as LulinRuns[],
  });

  return (
    <>
      <div className="container mx-auto px-4 h-200 max-h-200 w-full">
        <div className="py-6">
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
            Edit your observation
          </h1>
          {observationIsFetching ? (
            <LoadingSkeleton />
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight lg:text-2xl text-primary-foreground">
                {observation?.name}
              </span>
              <Badge
                key={`${observation?.id}-start`}
                className="mr-1 prevent-select"
              >
                {observation?.start_date.split(" ")[0]}
              </Badge>
              <Badge
                key={`${observation?.id}-end`}
                className="mr-1 prevent-select"
              >
                {observation?.end_date.split(" ")[0]}
              </Badge>
            </div>
          )}
        </div>

        {isFetching ? (
          <LoadingSkeleton />
        ) : (
          <VisibilityChart
            observation_id={props.observation_id}
            airmass={true}
          />
        )}

        <div className="flex flex-col items-center py-4">
          <LulinData
            observation_id={props.observation_id}
            data={lulinObservations}
            setCodeUpdate={setCodeUpdate}
            refetch={refetch}
          />
          <Sheet modal={true}>
            <SheetTrigger className="w-full">
              <Button disabled className="w-full">
                {" "}
                +{" "}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <NewLulinRun observation={observation} refetch={refetch} />
            </SheetContent>
          </Sheet>
        </div>

        <CodeBlock
          observation_id={props.observation_id}
          codeUpdate={codeUpdate}
          setCodeUpdate={setCodeUpdate}
        />
      </div>
    </>
  );
}
