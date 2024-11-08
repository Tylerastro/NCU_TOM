"use client";

import { getObservation } from "@/apis/observations/getObservation";
import { getObservationAltAz } from "@/apis/observations/getObservationAltAz";
import { getMoonAltAz } from "@/apis/targets/getMoonAltAz";
import { Observation } from "@/models/observations";
import { TargetAltAz } from "@/models/targets";
import stringToColor from "@/utils/getColor";
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

export default function VisibilityChart(props: {
  observation_id: number;
  airmass: boolean;
}) {
  const [AltAz, setAltAz] = useState<TargetAltAz[]>([]);
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  const [activeSeries, setActiveSeries] = useState<Record<string, boolean>>({});

  const { data: observation } = useQuery({
    queryKey: ["getVisibilityData", props.observation_id],
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
        airmass: d.airmass && d.airmass < 0 ? null : d.airmass,
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
              airmass: dd.airmass && dd.airmass < 0 ? null : dd.airmass,
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

      const newActiveSeries = combinedData.reduce((acc, series) => {
        acc[series.name] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setActiveSeries(newActiveSeries);

      const newColorMap = combinedData.reduce((acc, series) => {
        acc[series.name] = stringToColor(series.name);
        return acc;
      }, {} as Record<string, string>);
      setColorMap(newColorMap);
    }
  }, [moonData, targetData]);

  const AltAzTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-500 p-4 border border-gray-200 rounded shadow-md">
          <p className="font-bold">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const AirmassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-500 p-4 border border-gray-200 rounded shadow-md">
          <p className="font-bold">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(2)}`}
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
    <>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          syncId={"altaz"}
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
            domain={[0, 90]}
            allowDataOverflow={true}
            ticks={[0, 15, 30, 45, 60, 75, 90]}
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
          <Tooltip content={<AltAzTooltip />} />
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
              dot={false}
              key={s.name}
              stroke={colorMap[s.name]}
              activeDot={{ r: 4 }}
              strokeDasharray={activeSeries[s.name] ? "0 0" : "10 10"}
              opacity={activeSeries[s.name] ? 1 : 0.2}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {props.airmass && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            syncId={"altaz"}
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
              orientation="left"
              yAxisId={"airmass"}
              dataKey="airmass"
              reversed
              domain={[0, 5]}
              allowDataOverflow={true}
              label={{
                value: "Airmass",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                fill: "#fff",
              }}
              tick={{ fill: "#fff" }}
              stroke="#fff"
            />
            <Tooltip content={<AirmassTooltip />} />
            {AltAz.map((s) => (
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
                strokeDasharray={activeSeries[s.name] ? "0 0" : "10 10"}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
