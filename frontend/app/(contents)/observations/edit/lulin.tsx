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
import { Comments } from "@/models/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { EditObservationFrom } from "./editObservationForm";

import CodeBlock from "./codeblock";
import CommentsList from "./commentsList";
import DatePickerBadges from "./DatePickerBadge";
import LulinData from "./lulinData";
import { NewLulinRun } from "./newlulinForm";
import SubmitSection from "./submitSection";

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
  const [localComments, setLocalComments] = useState<Comments[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  // fetch data
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

  const refreshObservationData = () => {
    queryClient.invalidateQueries({ queryKey: ["getObservation", props.observation_id] });
  };

  // Sync local comments with observation data
  useEffect(() => {
    if (observation?.comments) {
      setLocalComments(observation.comments);
    }
  }, [observation?.comments]);

  // Background sync - refresh observation data every 30 seconds to keep data consistent
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ["getObservation", props.observation_id],
        refetchType: 'none' // Don't refetch immediately, just mark as stale
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [queryClient, props.observation_id]);

  // Function to add comment optimistically
  const addCommentOptimistically = (commentText: string) => {
    const currentUser = session?.user;
    const newComment: Comments = {
      id: Date.now(), // Temporary ID
      context: commentText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: currentUser?.id || 0,
        username: currentUser?.username || "Anonymous",
        institute: currentUser?.institute || "",
        title: 0, // Default value as UserProfile doesn't have title
        role: currentUser?.role || 0,
      },
    };
    setLocalComments(prev => [...prev, newComment]);
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

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section - Improved visual hierarchy */}
        <div className="py-6 border-b border-border/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground mb-2">
                Edit Observation
              </h1>
              {observationIsFetching ? (
                <LoadingSkeleton />
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <EditObservationFrom
                    pk={observation?.id}
                    observation={observation}
                  />
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
          </div>
        </div>

        {/* Main Content Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-6">
          {/* Left Column - Primary content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Visibility Chart Section */}
            <div className="bg-card/50 rounded-lg border border-border/50 p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary-foreground">
                Visibility Chart
              </h2>
              {isFetching ? (
                <LoadingSkeleton />
              ) : (
                <VisibilityChart
                  observation_id={props.observation_id}
                  airmass={true}
                />
              )}
            </div>

            {/* Observation Runs Section */}
            <div className="bg-card/50 rounded-lg border border-border/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary-foreground">
                  Observation Runs
                </h2>
                <Sheet modal={true}>
                  <SheetTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <span className="text-lg">+</span> Add Run
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <NewLulinRun observation={observation} refetch={refetch} />
                  </SheetContent>
                </Sheet>
              </div>
              <LulinData
                observation_id={props.observation_id}
                data={lulinObservations}
                setCodeUpdate={setCodeUpdate}
                refetch={refetch}
              />
            </div>

            {/* Code Block Section */}
            <div className="bg-card/50 rounded-lg border border-border/50 p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary-foreground">
                Generated Code
              </h2>
              <CodeBlock
                observation_id={props.observation_id}
                codeUpdate={codeUpdate}
                setCodeUpdate={setCodeUpdate}
              />
            </div>
          </div>

          {/* Right Column - Secondary content */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-card/50 rounded-lg border border-border/50 p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary-foreground">
                Comments & Notes
              </h2>
              <CommentsList
                comments={localComments}
                observationId={props.observation_id}
              />
            </div>

            {/* Submit Section - Moved closer to comments */}
            <div className="bg-card/50 rounded-lg border border-border/50 p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary-foreground">
                Submit & Finalize
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Review your observation data and submit when ready.
              </p>
              <SubmitSection 
                observation_id={props.observation_id} 
                onCommentAdded={addCommentOptimistically}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
