"use client";

import { Button } from "@/components/ui/button";
import { useUserDashboard } from "./hooks/useUserDashboard";
import UserStatsCards from "./components/UserStatsCards";
import RecentTargetsCard from "./components/RecentTargetsCard";
import RecentObservationsCard from "./components/RecentObservationsCard";
import QuickActionsCard from "./components/QuickActionsCard";
import ToolsSection from "./components/ToolsSection";

function RefreshIcon({ isSpinning }: { isSpinning: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

export default function UserDashboard() {
  const { targets, observations, stats, isLoading, refetch } = useUserDashboard();

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Overview of your targets and observations
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshIcon isSpinning={isLoading} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <UserStatsCards stats={stats} isLoading={isLoading} />

      {/* Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RecentTargetsCard targets={targets} isLoading={isLoading} />
        <RecentObservationsCard observations={observations} isLoading={isLoading} />
        <QuickActionsCard />
      </div>

      {/* Tools Section */}
      <ToolsSection />
    </div>
  );
}
