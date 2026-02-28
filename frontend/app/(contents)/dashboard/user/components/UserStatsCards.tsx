"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StatsCardsProps } from "./types";

const TargetIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
    <circle cx="12" cy="12" r="7" strokeWidth={2} />
  </svg>
);

const TelescopeIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  colorScheme: "neutral" | "emerald" | "sky" | "violet" | "amber";
}

function StatCard({ title, value, subtitle, icon, colorScheme }: StatCardProps) {
  const colorClasses = {
    neutral: {
      border: "border-neutral-200/60 dark:border-neutral-800/60",
      bg: "",
      title: "text-neutral-600 dark:text-neutral-400",
      iconBg: "bg-neutral-100 dark:bg-neutral-800",
      iconColor: "text-neutral-600 dark:text-neutral-400",
      value: "text-neutral-900 dark:text-neutral-50",
      subtitle: "text-neutral-500 dark:text-neutral-500",
    },
    emerald: {
      border: "border-emerald-200/60 dark:border-emerald-900/40",
      bg: "bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20",
      title: "text-emerald-700 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      value: "text-emerald-700 dark:text-emerald-400",
      subtitle: "text-emerald-600/70 dark:text-emerald-500/70",
    },
    sky: {
      border: "border-sky-200/60 dark:border-sky-900/40",
      bg: "bg-gradient-to-br from-sky-50/50 to-transparent dark:from-sky-950/20",
      title: "text-sky-700 dark:text-sky-400",
      iconBg: "bg-sky-100 dark:bg-sky-900/50",
      iconColor: "text-sky-600 dark:text-sky-400",
      value: "text-sky-700 dark:text-sky-400",
      subtitle: "text-sky-600/70 dark:text-sky-500/70",
    },
    violet: {
      border: "border-violet-200/60 dark:border-violet-900/40",
      bg: "bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-950/20",
      title: "text-violet-700 dark:text-violet-400",
      iconBg: "bg-violet-100 dark:bg-violet-900/50",
      iconColor: "text-violet-600 dark:text-violet-400",
      value: "text-violet-700 dark:text-violet-400",
      subtitle: "text-violet-600/70 dark:text-violet-500/70",
    },
    amber: {
      border: "border-amber-200/60 dark:border-amber-900/40",
      bg: "bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20",
      title: "text-amber-700 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/50",
      iconColor: "text-amber-600 dark:text-amber-400",
      value: "text-amber-700 dark:text-amber-400",
      subtitle: "text-amber-600/70 dark:text-amber-500/70",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className={`${colors.border} ${colors.bg}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${colors.title}`}>
          {title}
        </CardTitle>
        <div
          className={`h-8 w-8 rounded-lg ${colors.iconBg} flex items-center justify-center ${colors.iconColor}`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colors.value}`}>{value}</div>
        <p className={`text-xs mt-1 ${colors.subtitle}`}>{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export default function UserStatsCards({ stats, isLoading }: StatsCardsProps) {
  const displayValue = (value: number) => (isLoading ? "—" : value);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="My Targets"
        value={displayValue(stats.totalTargets)}
        subtitle="Total targets"
        icon={<TargetIcon />}
        colorScheme="sky"
      />
      <StatCard
        title="Observations"
        value={displayValue(stats.totalObservations)}
        subtitle="Total observations"
        icon={<TelescopeIcon />}
        colorScheme="violet"
      />
      <StatCard
        title="In Progress"
        value={displayValue(stats.inProgress)}
        subtitle="Active observations"
        icon={<ClockIcon />}
        colorScheme="amber"
      />
      <StatCard
        title="Completed"
        value={displayValue(stats.completed)}
        subtitle="Finished observations"
        icon={<CheckIcon />}
        colorScheme="emerald"
      />
    </div>
  );
}
