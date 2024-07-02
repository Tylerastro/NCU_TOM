import { getLulin } from "@/apis/observations/getLulin";
import { Skeleton } from "@/components/ui/skeleton";
import { LulinObservations } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CodeBlock from "./codeblock";
import LulinData from "./lulinData";
import MoonAltAz from "./moonAltAz";
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

  const { data: lulinObservations, isFetching } = useQuery({
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
        <div>
          <h1 className="my-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            Edit your observation
          </h1>
        </div>
        {isFetching ? (
          <LoadingSkeleton />
        ) : (
          <MoonAltAz observation_id={props.observation_id} />
        )}

        <div className="flex justify-center">
          <LulinData data={lulinObservations} setCodeUpdate={setCodeUpdate} />
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
