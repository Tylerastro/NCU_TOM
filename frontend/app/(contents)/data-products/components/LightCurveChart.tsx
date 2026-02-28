"use client";

import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { LulinDataProduct } from "@/types";
import { LulinFilter } from "@/types/enums";

interface LightCurveChartProps {
  data?: LulinDataProduct[];
  isLoading: boolean;
}

// Astronomical filter colors - based on actual wavelength bands
const FILTER_COLORS: Record<number, { color: string; label: string }> = {
  [LulinFilter.u]: { color: "#a855f7", label: "u-band (UV)" },
  [LulinFilter.g]: { color: "#22c55e", label: "g-band (Green)" },
  [LulinFilter.r]: { color: "#ef4444", label: "r-band (Red)" },
  [LulinFilter.i]: { color: "#f97316", label: "i-band (Near-IR)" },
  [LulinFilter.z]: { color: "#ec4899", label: "z-band (IR)" },
};

interface DataPoint {
  mjd: number;
  mag: number;
  filter: number;
  target: string;
  error?: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DataPoint }> }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const filterInfo = FILTER_COLORS[data.filter] || {
    color: "#64748b",
    label: "Unknown",
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg p-3 shadow-xl">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: filterInfo.color }}
          />
          <span className="font-mono text-sm text-slate-200">
            {filterInfo.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-slate-500">Target</span>
          <span className="text-slate-200 font-medium">{data.target}</span>
          <span className="text-slate-500">MJD</span>
          <span className="text-slate-200 font-mono">
            {data.mjd.toFixed(4)}
          </span>
          <span className="text-slate-500">Magnitude</span>
          <span className="text-slate-200 font-mono">{data.mag.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}

export function LightCurveChart({ data, isLoading }: LightCurveChartProps) {
  const [activeFilters, setActiveFilters] = useState<Set<number>>(
    new Set([
      LulinFilter.u,
      LulinFilter.g,
      LulinFilter.r,
      LulinFilter.i,
      LulinFilter.z,
    ])
  );

  const processedData = useMemo(() => {
    if (!data?.length) return { byFilter: {}, domain: { x: [0, 1], y: [0, 1] } };

    const byFilter: Record<number, DataPoint[]> = {};
    let minMjd = Infinity,
      maxMjd = -Infinity;
    let minMag = Infinity,
      maxMag = -Infinity;

    data.forEach((point) => {
      if (!byFilter[point.filter]) {
        byFilter[point.filter] = [];
      }
      byFilter[point.filter].push({
        mjd: point.mjd,
        mag: point.mag,
        filter: point.filter,
        target: point.target?.name || "Unknown",
      });

      minMjd = Math.min(minMjd, point.mjd);
      maxMjd = Math.max(maxMjd, point.mjd);
      minMag = Math.min(minMag, point.mag);
      maxMag = Math.max(maxMag, point.mag);
    });

    const padding = (maxMag - minMag) * 0.1 || 0.5;

    return {
      byFilter,
      domain: {
        x: [minMjd - 0.1, maxMjd + 0.1],
        // Magnitude is inverted (brighter = lower number)
        y: [maxMag + padding, minMag - padding],
      },
    };
  }, [data]);

  const toggleFilter = (filter: number) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40 bg-slate-700" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-7 w-16 rounded-full bg-slate-700" />
              ))}
            </div>
          </div>
          <Skeleton className="h-[350px] w-full bg-slate-800/50" />
        </div>
      </div>
    );
  }

  const hasData = Object.keys(processedData.byFilter).length > 0;

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-700/50 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-slate-100">
              Photometry Light Curve
            </h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Magnitude vs Modified Julian Date
            </p>
          </div>

          {/* Filter toggles */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(FILTER_COLORS).map(([key, { color, label }]) => {
              const filterNum = parseInt(key);
              const isActive = activeFilters.has(filterNum);
              const count = processedData.byFilter[filterNum]?.length || 0;

              return (
                <button
                  key={key}
                  onClick={() => toggleFilter(filterNum)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-200 border
                    ${
                      isActive
                        ? "border-transparent"
                        : "border-slate-600 bg-slate-800/50 text-slate-500"
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? `${color}20` : undefined,
                    color: isActive ? color : undefined,
                    borderColor: isActive ? `${color}40` : undefined,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: isActive ? color : "#64748b",
                    }}
                  />
                  <span>{label.split(" ")[0]}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        {hasData ? (
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                opacity={0.5}
              />
              <XAxis
                dataKey="mjd"
                type="number"
                domain={processedData.domain.x as [number, number]}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={{ stroke: "#475569" }}
                axisLine={{ stroke: "#475569" }}
                label={{
                  value: "MJD",
                  position: "bottom",
                  fill: "#64748b",
                  fontSize: 11,
                }}
                tickFormatter={(v) => v.toFixed(1)}
              />
              <YAxis
                dataKey="mag"
                type="number"
                domain={processedData.domain.y as [number, number]}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={{ stroke: "#475569" }}
                axisLine={{ stroke: "#475569" }}
                label={{
                  value: "Magnitude",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#64748b",
                  fontSize: 11,
                }}
                reversed
              />
              <Tooltip content={<CustomTooltip />} />

              {Object.entries(processedData.byFilter).map(([filter, points]) => {
                const filterNum = parseInt(filter);
                if (!activeFilters.has(filterNum)) return null;

                const color =
                  FILTER_COLORS[filterNum]?.color || "#64748b";

                return (
                  <Scatter
                    key={filter}
                    data={points}
                    fill={color}
                    opacity={0.8}
                  >
                    {/* Custom dot with glow effect */}
                  </Scatter>
                );
              })}
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">
                No photometry data available
              </p>
              <p className="text-slate-600 text-xs font-mono">
                Data will appear after pipeline processing
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer stats */}
      {hasData && (
        <div className="border-t border-slate-700/50 px-6 py-3 bg-slate-800/30">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">
              {data?.length || 0} data points · {Object.keys(processedData.byFilter).length} filters
            </span>
            <span className="font-mono">
              MJD range:{" "}
              {(processedData.domain.x[0] as number)?.toFixed(2)} –{" "}
              {(processedData.domain.x[1] as number)?.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
