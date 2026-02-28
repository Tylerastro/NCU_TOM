"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { ObservationStats } from "@/types";
import {
  Activity,
  Target,
  Telescope,
  TrendingUp,
  AlertTriangle,
  Database,
} from "lucide-react";

interface StatsOverviewProps {
  stats?: ObservationStats;
  isLoading: boolean;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  alert?: boolean;
  color: "emerald" | "cyan" | "violet" | "amber" | "rose";
}

const colorMap = {
  emerald: {
    bg: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
    icon: "text-emerald-400",
    value: "text-emerald-300",
  },
  cyan: {
    bg: "from-cyan-500/10 to-cyan-500/5",
    border: "border-cyan-500/20",
    glow: "shadow-cyan-500/10",
    icon: "text-cyan-400",
    value: "text-cyan-300",
  },
  violet: {
    bg: "from-violet-500/10 to-violet-500/5",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/10",
    icon: "text-violet-400",
    value: "text-violet-300",
  },
  amber: {
    bg: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/10",
    icon: "text-amber-400",
    value: "text-amber-300",
  },
  rose: {
    bg: "from-rose-500/10 to-rose-500/5",
    border: "border-rose-500/20",
    glow: "shadow-rose-500/10",
    icon: "text-rose-400",
    value: "text-rose-300",
  },
};

function StatCard({ label, value, icon, trend, alert, color }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border ${colors.border}
        bg-gradient-to-br ${colors.bg} backdrop-blur-sm
        p-5 transition-all duration-300 hover:scale-[1.02]
        shadow-lg ${colors.glow}
      `}
    >
      {/* Decorative corner accent */}
      <div
        className={`absolute top-0 right-0 w-20 h-20 ${colors.icon} opacity-5`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M100 0 L100 100 L0 100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-light tabular-nums tracking-tight ${colors.value}`}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {trend && (
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  trend.positive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                <TrendingUp
                  className={`w-3 h-3 ${!trend.positive && "rotate-180"}`}
                />
                {trend.value}%
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <div className={`p-2.5 rounded-lg bg-slate-800/50 ${colors.icon}`}>
            {icon}
          </div>
          {alert && (
            <div className="absolute -top-1 -right-1">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Subtle scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24 bg-slate-700" />
          <Skeleton className="h-8 w-16 bg-slate-700" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
      </div>
    </div>
  );
}

export function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  const inProgressCount =
    stats?.status_counts?.find((s) => s.id === 3)?.count ?? 0;
  const completedCount =
    stats?.status_counts?.find((s) => s.id === 4)?.count ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Observations"
        value={stats?.total_observations ?? 0}
        icon={<Activity className="w-5 h-5" />}
        color="emerald"
      />
      <StatCard
        label="Tracked Targets"
        value={stats?.total_targets ?? 0}
        icon={<Target className="w-5 h-5" />}
        color="cyan"
      />
      <StatCard
        label="Completed"
        value={completedCount}
        icon={<Database className="w-5 h-5" />}
        color="violet"
      />
      <StatCard
        label="In Progress"
        value={inProgressCount}
        icon={<Telescope className="w-5 h-5" />}
        color={inProgressCount > 0 ? "amber" : "emerald"}
        alert={inProgressCount > 5}
      />
    </div>
  );
}
