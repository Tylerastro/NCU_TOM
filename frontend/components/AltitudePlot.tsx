"use client";

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
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 20) + 60; // 60-80%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function AltChart(props: { observation_id: number }) {
  const [AltAz, setAltAz] = useState<TargetAltAz[]>([]);
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  const [activeSeries, setActiveSeries] = useState<Record<string, boolean>>({});

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

      const uniqueTargets: Record<string, TargetAltAz> = {};

      result.forEach((d) => {
        if (!uniqueTargets[d.name]) {
          uniqueTargets[d.name] = {
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
          };
        }
      });

      return Object.values(uniqueTargets);
    },
    initialData: [] as TargetAltAz[],
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

      // Initialize all series as active and assign colors
      const newActiveSeries = combinedData.reduce((acc, series) => {
        acc[series.name] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setActiveSeries(newActiveSeries);

      const newColorMap = combinedData.reduce((acc, series) => {
        acc[series.name] = getRandomColor();
        return acc;
      }, {} as Record<string, string>);
      setColorMap(newColorMap);
    }
  }, [moonData, targetData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-500 p-4 border border-gray-200 rounded shadow-md">
          <p className="font-bold">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(2)}°`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleLegendClick = (dataKey: string) => {
    setActiveSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        width={500}
        height={300}
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
      >
        <CartesianGrid
          strokeOpacity={0.3}
          strokeDasharray="3 3"
          stroke="#444"
        />
        <XAxis
          padding={{ left: 30, right: 30 }}
          dataKey="time"
          angle={-30}
          type="category"
          allowDuplicatedCategory={false}
          label={{
            value: "Time",
            position: "bottom",
            offset: 20,
            fill: "#fff",
          }}
          tick={{ dy: 10, fill: "#fff" }}
          stroke="#fff"
        />
        <YAxis
          yAxisId={"alt"}
          dataKey="alt"
          label={{
            value: "Altitude",
            angle: -90,
            position: "insideLeft",
            offset: 0,
            fill: "#fff",
          }}
          tick={{ fill: "#fff" }}
          stroke="#fff"
        />
        {/* <YAxis
          orientation="right"
          yAxisId={"airmass"}
          dataKey="airmass"
          label={{
            value: "Airmass",
            angle: 90,
            position: "insideRight",
            offset: 0,
            fill: "#fff",
          }}
          tick={{ fill: "#fff" }}
          stroke="#fff"
        /> */}
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          onClick={(props) => handleLegendClick(props.value)}
          wrapperStyle={{ color: "#fff" }}
        />
        {AltAz.map((s) => (
          <Line
            yAxisId={"alt"}
            dataKey="alt"
            data={s.data}
            name={s.name}
            key={s.name}
            stroke={colorMap[s.name]}
            dot={false}
            activeDot={{ r: 4 }}
            opacity={activeSeries[s.name] ? 1 : 0.2}
            strokeWidth={2}
          />
        ))}
        {/* {AltAz.map((s) => (
          <Line
            yAxisId={"airmass"}
            dataKey="airmass"
            data={s.data}
            name={s.name}
            key={s.name}
            stroke={colorMap[s.name]}
            dot={false}
            activeDot={{ r: 4 }}
            opacity={activeSeries[s.name] ? 1 : 0.2}
            strokeWidth={2}
          />
        ))} */}
      </LineChart>
    </ResponsiveContainer>
  );
}
