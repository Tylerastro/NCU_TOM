"use client";

import { getObservation, getObservationAltAz } from "@/apis/observations";
import { getMoonAltAz } from "@/apis/targets";
import { Observation } from "@/models/observations";
import { TargetAltAz } from "@/models/targets";
import stringToColor from "@/utils/getColor";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const useContainerWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setWidth(el.clientWidth);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
};

type MergedDataPoint = {
  time: number;
  [key: string]: number | null;
};

const MOON_COLOR = "hsl(45, 80%, 75%)";

export default function VisibilityChart(props: {
  observation_id: number;
  airmass: boolean;
}) {
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
        time: new Date(d.time).getTime(),
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
              time: new Date(dd.time).getTime() as unknown as string,
            })),
          };
        }
      });

      return Object.values(uniqueTargets);
    },
    initialData: [] as TargetAltAz[],
  });

  const { mergedData, seriesNames, colorMap } = useMemo(() => {
    const allSeries = [
      { name: "Moon", data: moonData },
      ...targetData.map((t) => ({
        name: t.name,
        data: t.data.map((d) => ({
          ...d,
          time:
            typeof d.time === "number" ? d.time : new Date(d.time).getTime(),
        })),
      })),
    ];

    const names = allSeries.map((s) => s.name);
    const colors: Record<string, string> = {};
    names.forEach((n) => {
      colors[n] = n === "Moon" ? MOON_COLOR : stringToColor(n);
    });

    // Build a map of time -> merged data point
    const timeMap = new Map<number, MergedDataPoint>();

    allSeries.forEach((series) => {
      series.data.forEach((d: any) => {
        const t = d.time as number;
        if (!timeMap.has(t)) {
          timeMap.set(t, { time: t });
        }
        const point = timeMap.get(t)!;
        point[`${series.name}_alt`] = d.alt;
        point[`${series.name}_airmass`] = d.airmass;
      });
    });

    const merged = Array.from(timeMap.values()).sort((a, b) => a.time - b.time);

    // Initialize activeSeries for new names
    setActiveSeries((prev) => {
      const next = { ...prev };
      let changed = false;
      names.forEach((n) => {
        if (!(n in next)) {
          next[n] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });

    return { mergedData: merged, seriesNames: names, colorMap: colors };
  }, [moonData, targetData]);

  const formatTick = (epochMs: number) => {
    return format(new Date(epochMs), "MM/dd HH:mm");
  };

  const handleLegendClick = useCallback((dataKey: string) => {
    setActiveSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const timeLabel =
      typeof label === "number"
        ? format(new Date(label), "yyyy/MM/dd HH:mm")
        : label;

    const visibleEntries = payload.filter(
      (entry: any) => entry.value != null
    );

    if (visibleEntries.length === 0) return null;

    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl px-4 py-3 text-sm">
        <p className="font-semibold text-popover-foreground mb-2 border-b border-border/50 pb-1.5">
          {timeLabel}
        </p>
        <div className="space-y-1">
          {visibleEntries.map((entry: any, index: number) => {
            const displayName = entry.name || entry.dataKey;
            return (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{displayName}:</span>
                <span className="font-medium text-popover-foreground ml-auto tabular-nums">
                  {entry.value.toFixed(2)}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const AirmassTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const timeLabel =
      typeof label === "number"
        ? format(new Date(label), "yyyy/MM/dd HH:mm")
        : label;

    const visibleEntries = payload.filter(
      (entry: any) => entry.value != null
    );

    if (visibleEntries.length === 0) return null;

    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl px-4 py-3 text-sm">
        <p className="font-semibold text-popover-foreground mb-2 border-b border-border/50 pb-1.5">
          {timeLabel}
        </p>
        <div className="space-y-1">
          {visibleEntries.map((entry: any, index: number) => {
            const displayName = entry.name || entry.dataKey;
            return (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{displayName}:</span>
                <span className="font-medium text-popover-foreground ml-auto tabular-nums">
                  {entry.value.toFixed(3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLegend = useCallback(
    (legendProps: any) => {
      const { payload } = legendProps;
      return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-2 pb-2">
          {payload?.map((entry: any) => {
            const name = entry.value;
            const isActive = activeSeries[name] !== false;
            return (
              <button
                key={name}
                type="button"
                onClick={() => handleLegendClick(name)}
                aria-label={`${isActive ? "Hide" : "Show"} ${name} series`}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-[color,background-color,opacity] duration-150 hover:bg-accent/50 ${
                  isActive ? "opacity-100" : "opacity-40"
                }`}
              >
                <span
                  className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-foreground">{name}</span>
              </button>
            );
          })}
        </div>
      );
    },
    [activeSeries, handleLegendClick]
  );

  const { ref: containerRef, width: chartWidth } = useContainerWidth();

  if (chartWidth === 0) {
    return <div ref={containerRef} className="w-full" style={{ minHeight: 500 }} />;
  }

  return (
    <div ref={containerRef} className="w-full">
      <LineChart
        syncId={"altaz"}
        data={mergedData}
        width={chartWidth}
        height={500}
        margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
      >
          <CartesianGrid
            strokeOpacity={0.15}
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />
          <ReferenceLine
            yAxisId={"alt"}
            y={15}
            stroke="#b45454"
            strokeDasharray="6 4"
            strokeOpacity={0.6}
            label={{
              value: "15° horizon limit",
              position: "insideTopRight",
              fill: "#d97070",
              fontSize: 11,
            }}
          />
          <XAxis
            padding={{ left: 20, right: 20 }}
            dataKey="time"
            angle={-35}
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatTick}
            label={{
              value: "Time (UTC+8)",
              position: "bottom",
              offset: 24,
              fill: "#94a3b8",
              fontSize: 12,
            }}
            tick={{ dy: 10, fill: "#94a3b8", fontSize: 11 }}
            tickLine={{ stroke: "#475569" }}
            axisLine={{ stroke: "#475569" }}
            stroke="#475569"
          />
          <YAxis
            yAxisId={"alt"}
            domain={[0, 90]}
            allowDataOverflow={true}
            ticks={[0, 15, 30, 45, 60, 75, 90]}
            label={{
              value: "Altitude (°)",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              fill: "#94a3b8",
              fontSize: 12,
            }}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={{ stroke: "#475569" }}
            axisLine={{ stroke: "#475569" }}
            stroke="#475569"
          />
          <Tooltip
            content={<CustomTooltip />}
            animationDuration={150}
            cursor={{
              stroke: "#64748b",
              strokeDasharray: "4 4",
              strokeOpacity: 0.4,
            }}
          />
          <Legend
            verticalAlign="top"
            content={renderLegend}
          />
          {seriesNames.map((name) => (
            <Line
              yAxisId={"alt"}
              dataKey={`${name}_alt`}
              name={name}
              dot={false}
              key={name}
              stroke={colorMap[name]}
              activeDot={{
                r: 5,
                fill: colorMap[name],
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
              strokeDasharray={
                activeSeries[name]
                  ? name === "Moon"
                    ? "6 3"
                    : "0 0"
                  : "10 10"
              }
              opacity={activeSeries[name] ? 1 : 0.2}
              strokeWidth={2}
              connectNulls={false}
              type="monotone"
            />
          ))}
      </LineChart>
      {props.airmass && (
        <LineChart
          syncId={"altaz"}
          data={mergedData}
          width={chartWidth}
          height={350}
          margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
        >
            <CartesianGrid
              strokeOpacity={0.15}
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <ReferenceLine
              yAxisId={"airmass"}
              y={2}
              stroke="#c09940"
              strokeDasharray="6 4"
              strokeOpacity={0.6}
              label={{
                value: "Airmass = 2",
                position: "insideTopRight",
                fill: "#d4ad50",
                fontSize: 11,
              }}
            />
            <XAxis
              padding={{ left: 20, right: 20 }}
              dataKey="time"
              angle={-35}
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatTick}
              label={{
                value: "Time (UTC+8)",
                position: "bottom",
                offset: 24,
                fill: "#94a3b8",
                fontSize: 12,
              }}
              tick={{ dy: 10, fill: "#94a3b8", fontSize: 11 }}
              tickLine={{ stroke: "#475569" }}
              axisLine={{ stroke: "#475569" }}
              stroke="#475569"
            />
            <YAxis
              orientation="left"
              yAxisId={"airmass"}
              reversed
              domain={[1, 5]}
              allowDataOverflow={true}
              label={{
                value: "Airmass",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                fill: "#94a3b8",
                fontSize: 12,
              }}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={{ stroke: "#475569" }}
              axisLine={{ stroke: "#475569" }}
              stroke="#475569"
            />
            <Tooltip
              content={<AirmassTooltip />}
              animationDuration={150}
              cursor={{
                stroke: "#64748b",
                strokeDasharray: "4 4",
                strokeOpacity: 0.4,
              }}
            />
            {seriesNames.map((name) => (
              <Line
                yAxisId={"airmass"}
                dataKey={`${name}_airmass`}
                name={name}
                key={name}
                stroke={colorMap[name]}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: colorMap[name],
                  stroke: "#0f172a",
                  strokeWidth: 2,
                }}
                opacity={activeSeries[name] ? 1 : 0.2}
                strokeDasharray={
                  activeSeries[name]
                    ? name === "Moon"
                      ? "6 3"
                      : "0 0"
                    : "10 10"
                }
                strokeWidth={2}
                connectNulls={false}
                type="monotone"
              />
            ))}
        </LineChart>
      )}
    </div>
  );
}
