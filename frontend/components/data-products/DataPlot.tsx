import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LulinFilter } from "@/models/enums";
import { LulinDataProduct } from "@/models/observations";
import { formatMJD, formatUTC } from "@/utils/timeFormatter";
import { useMemo } from "react";
import {
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 50%)`;
};
export default function DataPlot({ rawData }: { rawData: LulinDataProduct[] }) {
  const { processedData, targetColors, uniqueTargets } = useMemo(() => {
    if (!rawData)
      return { processedData: [], targetColors: {}, uniqueTargets: [] };
    const targets = Array.from(new Set(rawData.map((obs) => obs.name)));
    const colors: Record<string, string> = {};
    targets.forEach((target) => {
      colors[target] = stringToColor(target);
    });
    const processed = rawData.map((obs) => ({
      ...obs,
      obs_date_ms: new Date(obs.obs_date).getTime(),
      color: colors[obs.name],
    }));
    return {
      processedData: processed,
      targetColors: colors,
      uniqueTargets: targets,
    };
  }, [rawData]);
  return (
    <div className="col-span-7">
      <ChartContainer
        config={Object.fromEntries(
          uniqueTargets.map((target) => [
            target,
            {
              label: target,
              color: targetColors[target],
            },
          ])
        )}
        className="min-h-[200px]"
      >
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <XAxis
              type="number"
              dataKey="obs_date_ms"
              name="UTC"
              tickFormatter={(value) => formatUTC(value)}
              domain={["auto", "auto"]}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              type="number"
              dataKey="mag"
              name="Magnitude"
              unit=""
              reversed
              domain={["auto", "auto"]}
            />
            <Legend
              verticalAlign="top"
              fontSize={"12rem"}
              wrapperStyle={{ color: "#fff" }}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border rounded p-2">
                      <p className="font-bold" style={{ color: data.color }}>
                        {data.name}
                      </p>
                      <p>UTC: {formatUTC(data.obs_date, "MM-dd HH:mm:ss")}</p>
                      <p>MJD: {formatMJD(data.mjd, 3)}</p>
                      <p>Magnitude: {data.mag.toFixed(3)}</p>
                      <p>Filter: {LulinFilter[data.filter]}</p>
                      <p>Exposure: {data.exposure_time}s</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {uniqueTargets.map((target) => (
              <Scatter
                key={target}
                name={target}
                data={processedData.filter((obs) => obs.name === target)}
                fill={targetColors[target]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
