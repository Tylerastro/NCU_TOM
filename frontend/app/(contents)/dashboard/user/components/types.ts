/**
 * Type definitions for User Dashboard components
 */
import type { Target, Observation } from "@/types";
import { Status } from "@/types/enums";

export interface UserDashboardStats {
  totalTargets: number;
  totalObservations: number;
  inProgress: number;
  completed: number;
}

export interface UserDashboardData {
  targets: Target[];
  observations: Observation[];
  stats: UserDashboardStats;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export interface StatsCardsProps {
  stats: UserDashboardStats;
  isLoading: boolean;
}

export interface RecentTargetsCardProps {
  targets: Target[];
  isLoading: boolean;
}

export interface RecentObservationsCardProps {
  observations: Observation[];
  isLoading: boolean;
}

export const STATUS_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  [Status.Prep]: {
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-700 dark:text-neutral-300",
    label: "Prep",
  },
  [Status.Pending]: {
    bg: "bg-amber-100 dark:bg-amber-900/50",
    text: "text-amber-700 dark:text-amber-300",
    label: "Pending",
  },
  [Status.In_progress]: {
    bg: "bg-sky-100 dark:bg-sky-900/50",
    text: "text-sky-700 dark:text-sky-300",
    label: "In Progress",
  },
  [Status.Done]: {
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-300",
    label: "Done",
  },
  [Status.Expired]: {
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-500 dark:text-neutral-400",
    label: "Expired",
  },
  [Status.Denied]: {
    bg: "bg-red-100 dark:bg-red-900/50",
    text: "text-red-700 dark:text-red-300",
    label: "Denied",
  },
  [Status.Postponed]: {
    bg: "bg-orange-100 dark:bg-orange-900/50",
    text: "text-orange-700 dark:text-orange-300",
    label: "Postponed",
  },
};

export interface TimezoneInfo {
  id: string;
  name: string;
  offset: string;
  tz: string;
}

export const TIMEZONES: TimezoneInfo[] = [
  { id: "lulin", name: "Lulin Observatory", offset: "UTC+8", tz: "Asia/Taipei" },
  { id: "utc", name: "UTC", offset: "UTC+0", tz: "UTC" },
  { id: "hawaii", name: "Hawaii (HST)", offset: "UTC-10", tz: "Pacific/Honolulu" },
  { id: "chile", name: "Chile (CLT)", offset: "UTC-3", tz: "America/Santiago" },
  { id: "lapalma", name: "La Palma (WET)", offset: "UTC+0", tz: "Atlantic/Canary" },
];

export interface AstronomyTool {
  name: string;
  url: string;
  description: string;
}

export const ASTRONOMY_TOOLS: AstronomyTool[] = [
  {
    name: "SIMBAD",
    url: "https://simbad.u-strasbg.fr/simbad/",
    description: "Astronomical database",
  },
  {
    name: "NASA ADS",
    url: "https://ui.adsabs.harvard.edu/",
    description: "Publications search",
  },
  {
    name: "Stellarium",
    url: "https://stellarium-web.org/",
    description: "Web planetarium",
  },
  {
    name: "Clear Outside",
    url: "https://clearoutside.com/",
    description: "Weather forecast",
  },
];
