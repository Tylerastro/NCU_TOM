"use client";
import { getLulin } from "@/apis/observations/getLulin";
import { getObservation } from "@/apis/observations/getObservation";
import VisibilityChart from "@/components/observations/VisibilityPlot";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { LulinRuns, Observation } from "@/models/observations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CodeBlock from "./codeblock";
import DatePickerBadges from "./DatePickerBadge";
import LulinData from "./lulinData";
import { NewLulinRun } from "./newlulinForm";
import ExpireAlert from "@/components/observations/ExpireAlert";

export default function LulinPage(props: { observation_id: number }) {
  const [codeUpdate, setCodeUpdate] = useState(false);
  const [isDateExpired, setIsDateExpired] = useState(false);

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

  const queryClient = useQueryClient();
  const refreshAllData = () => {
    queryClient.invalidateQueries({ queryKey: ["getVisibilityData"] });
  };

  useEffect(() => {
    if (observation?.start_date) {
      const startDate = new Date(observation.start_date);
      const now = new Date();

      const startDateUTC = new Date(startDate.toUTCString());
      const nowUTC = new Date(now.toUTCString());

      setIsDateExpired(startDateUTC < nowUTC);
    }
  }, [observation?.start_date]);

  return (
    <>
      <ExpireAlert
        isDateExpired={isDateExpired}
        setIsDateExpired={setIsDateExpired}
      />
      <div className="container mx-auto px-4 h-200 max-h-200 w-full">
        <div className="py-6">
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
            Edit your observation
          </h1>
          <div className="flex items-center pt-3 space-x-2 gap-2">
            <span className="text-2xl font-bold tracking-tight lg:text-2xl text-primary-foreground">
              {observation?.name}
            </span>
            {observationIsFetching ? (
              <></>
            ) : (
              <DatePickerBadges
                observation={{
                  id: observation?.id,
                  start_date: observation?.start_date,
                  end_date: observation?.end_date,
                }}
                onDateChange={refreshAllData}
              />
            )}
          </div>
        </div>
        <VisibilityChart observation_id={props.observation_id} airmass={true} />

        <div className="flex flex-col items-center py-4">
          <LulinData
            observation_id={props.observation_id}
            data={lulinObservations}
            setCodeUpdate={setCodeUpdate}
            refetch={refetch}
          />
          <Sheet modal={true}>
            <SheetTrigger asChild className="w-full">
              <Button className="w-full"> + </Button>
            </SheetTrigger>
            <SheetContent>
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
