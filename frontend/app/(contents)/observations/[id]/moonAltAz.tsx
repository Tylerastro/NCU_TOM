import { getObservation } from "@/apis/observations/getObservation";
import { getObservationAltAz } from "@/apis/observations/getObservationAltAz";
import { getMoonAltAz } from "@/apis/targets/getMoonAltAz";
import { Observation } from "@/models/observations";
import { TargetAltAz } from "@/models/targets";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function MoonAltAz(props: { observation_id: number }) {
  const [AltAz, setAltAz] = useState<TargetAltAz[]>([]);

  const { data: observation } = useQuery({
    queryKey: ["observation", props.observation_id],
    queryFn: async () =>
      getObservation(props.observation_id).then((data) => {
        return data;
      }),
    initialData: {} as Observation,
  });

  const { data: moonData } = useQuery({
    queryKey: ["getMoonAltAz", observation.start_date, observation.end_date],
    queryFn: async () => {
      const result: TargetAltAz = await getMoonAltAz(
        observation.start_date,
        observation.end_date
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
    enabled: Boolean(observation.start_date && observation.end_date),
  });

  const { data: targetData } = useQuery({
    queryKey: [
      "getObservationAltAz",
      props.observation_id,
      observation.start_date,
      observation.end_date,
    ],
    queryFn: async () => {
      const result: TargetAltAz[] = await getObservationAltAz(
        props.observation_id
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

  useEffect(() => {
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
