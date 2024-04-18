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

const series = [
  {
    name: "Series 1",
    data: [
      { category: "A", value: Math.random() },
      { category: "B", value: Math.random() },
      { category: "C", value: Math.random() },
    ],
  },
  {
    name: "Series 2",
    data: [
      { category: "B", value: Math.random() },
      { category: "C", value: Math.random() },
      { category: "D", value: Math.random() },
    ],
  },
  {
    name: "Series 3",
    data: [
      { category: "C", value: Math.random() },
      { category: "D", value: Math.random() },
      { category: "E", value: Math.random() },
    ],
  },
];

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
            data: moonData.data, // Assuming the new data structure
          },
          ...targetData,
        ];

        setAltAz(combinedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, [props.start_date, props.end_date, props.observation_id]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart width={500} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" type="category" allowDuplicatedCategory={false} />
        <YAxis dataKey="alt" />
        <Tooltip />
        <Legend />
        {AltAz.map((s) => (
          <Line dataKey="alt" data={s.data} name={s.name} key={s.name} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
