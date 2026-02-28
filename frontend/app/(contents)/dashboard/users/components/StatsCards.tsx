import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCardsProps } from "./types";

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BookIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const BanIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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
        <div className={`h-8 w-8 rounded-lg ${colors.iconBg} flex items-center justify-center ${colors.iconColor}`}>
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

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const displayValue = (value: number) => (isLoading ? "—" : value);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Total Users"
        value={displayValue(stats.total)}
        subtitle="Registered accounts"
        icon={<UsersIcon />}
        colorScheme="neutral"
      />
      <StatCard
        title="Active Users"
        value={displayValue(stats.active)}
        subtitle="Currently enabled"
        icon={<CheckIcon />}
        colorScheme="emerald"
      />
      <StatCard
        title="Faculty"
        value={displayValue(stats.faculty)}
        subtitle="Faculty members"
        icon={<BookIcon />}
        colorScheme="sky"
      />
      <StatCard
        title="Admins"
        value={displayValue(stats.admins)}
        subtitle="Administrators"
        icon={<ShieldIcon />}
        colorScheme="violet"
      />
      <StatCard
        title="Disabled"
        value={displayValue(stats.disabled)}
        subtitle="Inactive or deleted"
        icon={<BanIcon />}
        colorScheme="amber"
      />
    </div>
  );
}
