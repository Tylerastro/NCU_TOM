import { getLulin } from "@/apis/observations";
import { LulinObservations } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import CodeBlock from "./codeblock";
import LulinData from "./lulinData";
import MoonAltAz from "./moonAltAz";

interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: { x: number; y: number }[];
    borderColor: string;
    fill: boolean;
  }[];
}

export default function Lulin(props: {
  start_date: string;
  end_date: string;
  observation_id: number;
}) {
  const [dataReady, setDataReady] = React.useState(true);
  const [codeUpdate, setCodeUpdate] = React.useState(false);

  let LineChartData: LineChartData = {
    labels: [], // These labels represent each line segment
    datasets: [],
  };

  const { data: lulinObservations } = useQuery({
    queryKey: ["getLulin"],
    queryFn: () => getLulin(props.observation_id),
    initialData: [] as LulinObservations[],
  });

  return (
    <>
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
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

      {lulinObservations.map((observation, index) => (
        <LulinData key={index} {...observation} setCodeUpdate={setCodeUpdate} />
      ))}
      <CodeBlock
        observation_id={props.observation_id}
        codeUpdate={codeUpdate}
        setCodeUpdate={setCodeUpdate}
      />
    </>
  );
}
