import { getLulin, getObservationAltAz } from "@/apis/observations";
import { getMoonAltAz } from "@/apis/targets";
import { LulinObservations } from "@/models/observations";
import { TargetAltAz } from "@/models/targets";
import { Box, Typography } from "@mui/material";
import * as React from "react";
import CodeBlock from "./codeblock";
import DynamicLineChart from "./dynamicLine";
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
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export default function Lulin(props: {
  start_date: string;
  end_date: string;
  observation_id: number;
}) {
  const [targetAltAz, setTargetAltAz] = React.useState<TargetAltAz[]>([]);
  const [dataReady, setDataReady] = React.useState(false);
  const [codeUpdate, setCodeUpdate] = React.useState(false);

  let LineChartData: LineChartData = {
    labels: [], // These labels represent each line segment
    datasets: [],
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Fetch moon data
        const moonData: TargetAltAz = await getMoonAltAz(
          props.start_date,
          props.end_date
        );

        // Fetch target data (list of objects)
        const targetData = await getObservationAltAz(
          props.observation_id,
          props.start_date,
          props.end_date
        );

        // Combine moon data with target data into a single list
        const combinedData: TargetAltAz[] = [
          {
            name: "Moon",
            data: {
              time: moonData.data.time,
              alt: moonData.data.alt,
              az: moonData.data.az,
            },
          },
          ...targetData,
        ];

        setTargetAltAz(combinedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, [props.start_date, props.end_date, props.observation_id]);

  React.useEffect(() => {
    if (targetAltAz && targetAltAz.length > 0) {
      setDataReady(true);
    }
  }, [targetAltAz]);

  if (dataReady) {
    LineChartData = {
      labels: [], // These labels represent each line segment
      datasets: targetAltAz.map((target) => ({
        label: target.name,
        data: target.data.time.map((time, index) => {
          // Check if time string contains milliseconds
          const millisecondPattern = /\.\d{3}/;
          let date = new Date(time);
          if (millisecondPattern.test(time)) {
            date = new Date(date.getTime() + 60000);
          }
          return {
            x: date.getTime(),
            y: target.data.alt[index],
          };
        }),
        borderColor: getRandomColor(),
        fill: false,
      })),
    };
  }

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
