"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { LulinDataProduct } from "@/types";
import { LulinFilter, LulinInstrument } from "@/types/enums";

interface FilterDistributionProps {
  data?: LulinDataProduct[];
  isLoading: boolean;
}

const FILTER_COLORS: Record<number, string> = {
  [LulinFilter.u]: "#a855f7",
  [LulinFilter.g]: "#22c55e",
  [LulinFilter.r]: "#ef4444",
  [LulinFilter.i]: "#f97316",
  [LulinFilter.z]: "#ec4899",
};

const FILTER_LABELS: Record<number, string> = {
  [LulinFilter.u]: "u-band",
  [LulinFilter.g]: "g-band",
  [LulinFilter.r]: "r-band",
  [LulinFilter.i]: "i-band",
  [LulinFilter.z]: "z-band",
};

const INSTRUMENT_LABELS: Record<number, string> = {
  [LulinInstrument.LOT]: "LOT",
  [LulinInstrument.SLT]: "SLT",
  [LulinInstrument.TRIPOL]: "TRIPOL",
};

interface ChartData {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartData }> }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: data.color }}
        />
        <span className="text-sm text-slate-200">{data.name}</span>
        <span className="text-sm font-mono text-slate-400">{data.value}</span>
      </div>
    </div>
  );
}

export function FilterDistribution({ data, isLoading }: FilterDistributionProps) {
  const { filterData, instrumentData, totalPoints } = useMemo(() => {
    if (!data?.length) {
      return { filterData: [], instrumentData: [], totalPoints: 0 };
    }

    const filterCounts: Record<number, number> = {};
    const instrumentCounts: Record<number, number> = {};

    data.forEach((point) => {
      filterCounts[point.filter] = (filterCounts[point.filter] || 0) + 1;
      instrumentCounts[point.instrument] =
        (instrumentCounts[point.instrument] || 0) + 1;
    });

    const filterData: ChartData[] = Object.entries(filterCounts).map(
      ([filter, count]) => ({
        name: FILTER_LABELS[parseInt(filter)] || `Filter ${filter}`,
        value: count,
        color: FILTER_COLORS[parseInt(filter)] || "#64748b",
      })
    );

    const instrumentColors = ["#06b6d4", "#8b5cf6", "#f59e0b"];
    const instrumentData: ChartData[] = Object.entries(instrumentCounts).map(
      ([inst, count], idx) => ({
        name: INSTRUMENT_LABELS[parseInt(inst)] || `Instrument ${inst}`,
        value: count,
        color: instrumentColors[idx % instrumentColors.length],
      })
    );

    return {
      filterData: filterData.sort((a, b) => b.value - a.value),
      instrumentData: instrumentData.sort((a, b) => b.value - a.value),
      totalPoints: data.length,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-6 h-full">
        <Skeleton className="h-6 w-40 bg-slate-700 mb-6" />
        <Skeleton className="h-40 w-40 rounded-full bg-slate-800/50 mx-auto mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full bg-slate-700" />
          ))}
        </div>
      </div>
    );
  }

  const hasData = filterData.length > 0;

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden h-full">
      {/* Header */}
      <div className="border-b border-slate-700/50 px-6 py-4">
        <h2 className="text-lg font-medium text-slate-100">
          Data Distribution
        </h2>
        <p className="text-xs font-mono text-slate-500 mt-0.5">
          By filter band & instrument
        </p>
      </div>

      <div className="p-6">
        {hasData ? (
          <div className="space-y-8">
            {/* Filter Distribution Chart */}
            <div>
              <div className="relative h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filterData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {filterData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          opacity={0.85}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-2xl font-light text-slate-200 tabular-nums">
                      {totalPoints}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">
                      Points
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {filterData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-400 truncate">{item.name}</span>
                    <span className="text-slate-500 font-mono ml-auto">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instrument Breakdown */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
                Instruments
              </h3>
              <div className="space-y-2.5">
                {instrumentData.map((item) => {
                  const percentage = ((item.value / totalPoints) * 100).toFixed(
                    1
                  );
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">
                          {item.name}
                        </span>
                        <span className="text-slate-500 font-mono">
                          {item.value}{" "}
                          <span className="text-slate-600">({percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">No distribution data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
