"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RecentTargetsCardProps } from "./types";

function formatCoordinate(value: number, type: "ra" | "dec"): string {
  if (type === "ra") {
    const hours = Math.floor(value / 15);
    const minutes = Math.floor((value / 15 - hours) * 60);
    const seconds = ((value / 15 - hours) * 60 - minutes) * 60;
    return `${hours}h ${minutes}m ${seconds.toFixed(1)}s`;
  } else {
    const sign = value >= 0 ? "+" : "-";
    const absVal = Math.abs(value);
    const degrees = Math.floor(absVal);
    const minutes = Math.floor((absVal - degrees) * 60);
    const seconds = ((absVal - degrees) * 60 - minutes) * 60;
    return `${sign}${degrees}° ${minutes}' ${seconds.toFixed(1)}"`;
  }
}

function TargetIcon() {
  return (
    <svg
      className="h-4 w-4 text-neutral-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="3" strokeWidth={2} />
      <circle cx="12" cy="12" r="7" strokeWidth={2} />
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
        <TargetIcon />
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
        No targets yet
      </p>
      <Button asChild size="sm" variant="outline">
        <Link href="/targets">Create your first target</Link>
      </Button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
            <div className="h-3 w-40 bg-neutral-100 dark:bg-neutral-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecentTargetsCard({
  targets,
  isLoading,
}: RecentTargetsCardProps) {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">Recent Targets</CardTitle>
            <CardDescription className="text-xs">
              Your latest astronomical targets
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/targets">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : targets.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {targets.map((target) => (
              <Link
                key={target.id}
                href={`/targets/${target.id}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                  <TargetIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {target.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {formatCoordinate(target.ra, "ra")} / {formatCoordinate(target.dec, "dec")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
