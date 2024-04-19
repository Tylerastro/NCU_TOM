import * as React from "react";
import {
  LineChart,
  CartesianAxis,
  CartesianGrid,
  Legend,
  Line,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
import { getMoonAltAz } from "@/apis/targets";
import { TargetAltAz } from "@/models/targets";
import { getObservationAltAz } from "@/apis/observations";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function MoonAltAz(props: {
  start_date: string;
  end_date: string;
  observation_id: number;
}) {
  const [AltAz, setAltAz] = React.useState<TargetAltAz[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Fetch moon data
        const moonData: TargetAltAz = await getMoonAltAz(
          props.start_date,
          props.end_date
        );

        // Fetch target data (list of objects)
        const targetData: TargetAltAz[] = await getObservationAltAz(
          props.observation_id,
          props.start_date,
          props.end_date
        );

        // Combine moon data with target data into a single list
        const combinedData: TargetAltAz[] = [
          {
            name: "Moon",
            data: moonData.data.map((d) => {
              const millisecondPattern = /\.\d{3}/;
              let date = new Date(d.time);
              if (millisecondPattern.test(d.time)) {
                date = new Date(date.getTime() + 60000);
              }
              return {
                time: date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hourCycle: "h23",
                }),
                alt: d.alt,
                az: d.az,
              };
            }),
          },
          ...targetData.map((d) => {
            return {
              name: d.name,
              data: d.data.map((dd) => {
                const millisecondPattern = /\.\d{3}/;
                let date = new Date(dd.time);
                if (millisecondPattern.test(dd.time)) {
                  date = new Date(date.getTime() + 60000);
                }
                const formattedDate = date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hourCycle: "h23",
                });
                return {
                  time: formattedDate,
                  alt: dd.alt,
                  az: dd.az,
                };
              }),
            };
          }),
        ];

        setAltAz(combinedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, [props.start_date, props.end_date, props.observation_id]);

  React.useEffect(() => {
    console.log(AltAz);
  }, [AltAz]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart width={500} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          padding={{ left: 30, right: 30 }}
          dataKey="time"
          angle={-30}
          type="category"
          allowDuplicatedCategory={false}
        />
        <YAxis dataKey="alt" />
        <Tooltip />
        <Legend />
        {AltAz.map((s) => (
          <Line
            dataKey="alt"
            data={s.data}
            name={s.name}
            key={s.name}
            stroke={getRandomColor()}
            dot={false}
            activeDot={false}
            hide={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
