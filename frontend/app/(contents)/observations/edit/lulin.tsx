"use client";
import { getLulin } from "@/apis/observations/getLulin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { getObservation } from "@/apis/observations/getObservation";
import VisibilityChart from "@/components/observations/VisibilityPlot";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { LulinRuns, Observation } from "@/models/observations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CodeBlock from "./codeblock";
import DatePickerBadges from "./DatePickerBadge";
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

const getTitleSize = (times: number) => {
  const sizes = [
    "text-lg", // Default size
    "text-xl", // After 1 ignore
    "text-2xl", // After 2 ignores
    "text-3xl", // After 3 ignores
    "text-4xl", // After 4 ignores
    "text-5xl", // After 5 ignores
  ];

  const colors = [
    "text-primary-foreground", // Default color
    "text-orange-500", // After a few ignores
    "text-red-500", // Getting more urgent
    "text-red-600", // Even more urgent
    "text-red-700", // Maximum urgency
  ];

  const sizeIndex = Math.min(times, sizes.length - 1);
  const colorIndex = Math.min(Math.floor(times / 2), colors.length - 1);

  return `${sizes[sizeIndex]} ${colors[colorIndex]} font-bold transition-all duration-300`;
};

export default function LulinPage(props: { observation_id: number }) {
  const [codeUpdate, setCodeUpdate] = useState(false);
  const [isDateExpired, setIsDateExpired] = useState(false);
  const [ignoretimes, setIgnoreTimes] = useState(0);
  const router = useRouter();

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

  const handleAlertClose = () => {
    setIsDateExpired(false);
    setIgnoreTimes(0);
  };

  const handleIgnoreTimes = () => {
    setIsDateExpired(true);
    setIgnoreTimes(ignoretimes + 1);
  };

  useEffect(() => {
    if (ignoretimes > 5) {
      toast.error(
        "You need to acknowledge that time machine is not invented yet!"
      );
      router.push("/observations");
    }
  }, [ignoretimes]);

  return (
    <>
      <AlertDialog open={isDateExpired}>
        <AlertDialogContent className={ignoretimes > 5 ? "animate-bounce" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle className={getTitleSize(ignoretimes)}>
              The start date is expired
              {ignoretimes > 3 && "!!!".repeat(Math.min(ignoretimes - 3, 3))}
            </AlertDialogTitle>
            <AlertDialogDescription
              className={ignoretimes > 2 ? "font-semibold" : ""}
            >
              Please update the start date since we can not travel back in time
              ⌛️
              {ignoretimes > 4 && (
                <span className="block mt-2 text-red-500">
                  You have ignored this {ignoretimes} times! Please take action!
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleIgnoreTimes}
              className={ignoretimes > 3 ? "opacity-50" : ""}
            >
              Ignore
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAlertClose}
              className={ignoretimes > 2 ? "animate-pulse" : ""}
            >
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto px-4 h-200 max-h-200 w-full">
        <div className="py-6">
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
            Edit your observation
          </h1>
          {observationIsFetching ? (
            <LoadingSkeleton />
          ) : (
            <div className="flex items-center pt-3 space-x-2 gap-2">
              <span className="text-2xl font-bold tracking-tight lg:text-2xl text-primary-foreground">
                {observation?.name}
              </span>
              <DatePickerBadges
                observation={{
                  id: observation?.id,
                  start_date: observation?.start_date,
                  end_date: observation?.end_date,
                }}
                onDateChange={refreshAllData}
              />
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
            <SheetTrigger asChild className="w-full">
              <Button className="w-full"> + </Button>
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
