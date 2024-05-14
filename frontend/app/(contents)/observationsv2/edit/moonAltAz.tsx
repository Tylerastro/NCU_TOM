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
import { useQuery } from "@tanstack/react-query";
import { TargetAltAz } from "@/models/targets";
import TargetApis from "@/apis/targets";
import ObservationApis from "@/apis/observations";

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
  const { getMoonAltAz } = TargetApis();
  const { getObservationAltAz } = ObservationApis();
  const [AltAz, setAltAz] = React.useState<TargetAltAz[]>([]);

  const { data: moonData } = useQuery({
    queryKey: ["getMoonAltAz", props.start_date, props.end_date],
    queryFn: async () => {
      const result: TargetAltAz = await getMoonAltAz(
        props.start_date,
        props.end_date
      );
      return result.data.map((d) => ({
        ...d,
        time: new Date(d.time).toLocaleDateString("en-US", {
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
      }));
    },
    initialData: [],
  });

  const { data: targetData } = useQuery({
    queryKey: [
      "getObservationAltAz",
      props.observation_id,
      props.start_date,
      props.end_date,
    ],
    queryFn: async () => {
      const result: TargetAltAz[] = await getObservationAltAz(
        props.observation_id,
        props.start_date,
        props.end_date
      );
      return result.map((d) => ({
        name: d.name,
        data: d.data.map((dd) => ({
          ...dd,
          time: new Date(dd.time).toLocaleDateString("en-US", {
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
          }),
        })),
      }));
    },
    initialData: [],
  });

  React.useEffect(() => {
    if (moonData && targetData) {
      const combinedData = [
        {
          name: "Moon",
          data: moonData,
        },
        ...targetData,
      ];
      setAltAz(combinedData);
    }
  }, [moonData, targetData]);

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
