import { getLulin, getObservationAltAz } from "@/apis/observations";
import { getMoonAltAz } from "@/apis/targets";
import { LulinObservations } from "@/models/observations";
import { TargetAltAz } from "@/models/targets";
import { Box, Typography } from "@mui/material";
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
  const [targetAltAz, setTargetAltAz] = React.useState<TargetAltAz[]>([]);
  const [dataReady, setDataReady] = React.useState(true);
  const [codeUpdate, setCodeUpdate] = React.useState(false);

  let LineChartData: LineChartData = {
    labels: [], // These labels represent each line segment
    datasets: [],
  };

  React.useEffect(() => {
    if (targetAltAz && targetAltAz.length > 0) {
      setDataReady(true);
    }
  }, [targetAltAz]);

  const [lulinObservations, setLulinObservations] = React.useState<
    LulinObservations[]
  >([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLulin(props.observation_id);
        setLulinObservations(data);
      } catch (error) {
        console.error("Failed to fetch Lulin observations", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h4">Edit your submission</Typography>
      </Box>
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
