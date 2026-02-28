"use client";

import { getLulinData } from "@/apis/dataProducts";
import { getETLLogs } from "@/apis/logs";
import { getObservationStats } from "@/apis/observations";
import { useQuery } from "@tanstack/react-query";
import { StatsOverview } from "./components/StatsOverview";
import { LightCurveChart } from "./components/LightCurveChart";
import { FilterDistribution } from "./components/FilterDistribution";
import { PipelineTimeline } from "./components/PipelineTimeline";
import { RecentDataTable } from "./components/RecentDataTable";

export default function DataProducts() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["observationStats"],
    queryFn: getObservationStats,
    refetchOnWindowFocus: false,
  });

  const { data: lulinData, isLoading: lulinLoading } = useQuery({
    queryKey: ["lulinData"],
    queryFn: getLulinData,
    refetchOnWindowFocus: false,
  });

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ["etlLogs"],
    queryFn: getETLLogs,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b ">
      {/* Starfield background pattern */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.3), transparent),
                           radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.2), transparent),
                           radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.3), transparent),
                           radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.2), transparent),
                           radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.25), transparent),
                           radial-gradient(1.5px 1.5px at 160px 120px, rgba(255,255,255,0.4), transparent)`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
            </div>
            <h1 className="text-3xl font-light tracking-wide text-slate-100">
              <span className="font-semibold">LULIN</span> Data Products
            </h1>
          </div>
          <p className="text-slate-400 font-mono text-sm tracking-wider uppercase">
            Observatory Control · Real-time Pipeline Monitoring
          </p>
        </header>

        {/* Stats Overview */}
        <StatsOverview stats={stats} isLoading={statsLoading} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Light Curve - spans 2 columns */}
          <div className="xl:col-span-2">
            <LightCurveChart data={lulinData} isLoading={lulinLoading} />
          </div>

          {/* Filter Distribution */}
          <div className="xl:col-span-1">
            <FilterDistribution data={lulinData} isLoading={lulinLoading} />
          </div>
        </div>

        {/* Pipeline Timeline & Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PipelineTimeline logs={logs} isLoading={logsLoading} />
          <RecentDataTable data={lulinData} isLoading={lulinLoading} />
        </div>
      </div>
    </div>
  );
}
