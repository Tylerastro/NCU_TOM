"use client";
import { getObservations } from "@/apis/observations/getObservations";
import { putObservation } from "@/apis/observations/putObservation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Status } from "@/models/enums";
import { Observation } from "@/models/observations";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import PageContent from "./pageContent";
import { getObservation } from "@/apis/observations/getObservation";

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
  const { data: observation, isFetching } = useQuery({
    queryKey: ["observations"],
    queryFn: () =>
      getObservation(params.id).then((data) => {
        return data;
      }),
    initialData: {} as Observation,
  });

  const mutation = useMutation({
    mutationFn: (values: { status: number }) => {
      return putObservation(params.id, values);
    },
    onSuccess: () => {
      toast.success("Status updated successfully");
    },
  });

  return (
    <>
      <div className="flex space-between justify-between pb-10">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            {isFetching ? <span className="loader"></span> : observation.name}
          </h1>
        </div>
        <div className="flex gap-2">
          {isFetching ? (
            <LoadingSkeleton />
          ) : (
            <Select
              onValueChange={(status) =>
                mutation.mutate({ status: Number(status) })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={Status[observation.status].replace("_", " ")}
                />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Status)
                  .filter((value) => typeof value === "number")
                  .map((stat) => (
                    <SelectItem key={stat} value={String(stat)}>
                      {Status[stat as number].replace("_", " ")}
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
        <PageContent observation={observation} />
      )}
    </>
  );
}
