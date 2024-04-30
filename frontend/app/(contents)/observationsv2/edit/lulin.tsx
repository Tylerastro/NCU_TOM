import { getLulin } from "@/apis/observations";
import { LulinObservations } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import CodeBlock from "./codeblock";
import LulinData from "./lulinData";
import MoonAltAz from "./moonAltAz";

export default function Lulin(props: {
  start_date: string;
  end_date: string;
  observation_id: number;
}) {
  const [dataReady, setDataReady] = React.useState(true);
  const [codeUpdate, setCodeUpdate] = React.useState(false);

  const { data: lulinObservations } = useQuery({
    queryKey: ["getLulin"],
    queryFn: () => getLulin(props.observation_id),
    initialData: [] as LulinObservations[],
  });

  return (
    <>
      <div className="container mx-auto px-4 h-200 max-h-200 w-full">
        <div>
          <h1 className="my-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            Edit your submission
          </h1>
        </div>
        {/* <DynamicHorizontalBarChart data={chartData} /> */}
        {dataReady ? (
          <MoonAltAz
            start_date={props.start_date}
            end_date={props.end_date}
            observation_id={props.observation_id}
          />
        ) : (
          <p>Loading data</p>
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
