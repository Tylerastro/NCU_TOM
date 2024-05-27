"use client";
import { Skeleton } from "@/components/ui/skeleton";
import ObservationApis from "@/apis/observations";
import { useQuery } from "@tanstack/react-query";
import PageContent from "./pageContent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Observation } from "@/models/observations";
import { Status } from "@/models/enums";

function LoadingSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default function Page({ params }: { params: { id: number } }) {
  const { getObservations } = ObservationApis();
  const { data: observation, isFetching } = useQuery({
    queryKey: ["observations"],
    queryFn: () => getObservations(params.id),
    initialData: () => [] as Observation[],
  });

  const statusValues = Object.values(Status).filter(
    (value) => typeof value === "string"
  );

  return (
    <>
      <div className="flex space-between justify-between pb-10">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            {isFetching ? (
              <span className="loader"></span>
            ) : (
              observation[0].name
            )}
          </h1>
        </div>
        <div className="flex gap-2">
          {isFetching ? (
            <LoadingSkeleton />
          ) : (
            <Select defaultValue={Status[observation[0].status]}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={Status[observation[0].status]} />
              </SelectTrigger>
              <SelectContent>
                {statusValues.map((status) => (
                  <SelectItem key={status} value={status.toString()}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {isFetching ? (
        <LoadingSkeleton />
      ) : (
        <PageContent observation={observation[0]} />
      )}
    </>
  );
}
