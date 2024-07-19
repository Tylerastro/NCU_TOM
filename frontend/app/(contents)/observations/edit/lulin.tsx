import { getLulin } from "@/apis/observations/getLulin";
import { Skeleton } from "@/components/ui/skeleton";
import { LulinObservations, Observation } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "./codeblock";
import LulinData from "./lulinData";
import MoonAltAz from "./moonAltAz";
import { getObservations } from "@/apis/observations/getObservations";
import { Button } from "@/components/ui/button";
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

export default function Lulin(props: { observation_id: number }) {
  const [codeUpdate, setCodeUpdate] = useState(false);

  const { data: observation } = useQuery({
    queryKey: ["getObservation", props.observation_id],
    queryFn: () =>
      getObservations({ observationId: props.observation_id }).then((data) => {
        return data.results[0] as Observation;
      }),
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
    initialData: [] as LulinObservations[],
  });

  return (
    <>
      <div className="container mx-auto px-4 h-200 max-h-200 w-full">
        <div className="py-6">
          <h1 className="my-10 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            Edit your observation
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight lg:text-2xl text-primary-foreground">
              {observation?.name}
            </span>
            <Badge key={`${observation?.id}-start`} className="mr-1">
              {observation?.start_date.split(" ")[0]}
            </Badge>
            <Badge key={`${observation?.id}-end`} className="mr-1">
              {observation?.end_date.split(" ")[0]}
            </Badge>
          </div>
        </div>

        {isFetching ? (
          <LoadingSkeleton />
        ) : (
          <MoonAltAz observation_id={props.observation_id} />
        )}

        <div className="flex flex-col items-center py-4">
          <LulinData
            data={lulinObservations}
            setCodeUpdate={setCodeUpdate}
            refetch={refetch}
          />
          <Button disabled className="w-full">
            {" "}
            +{" "}
          </Button>
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
