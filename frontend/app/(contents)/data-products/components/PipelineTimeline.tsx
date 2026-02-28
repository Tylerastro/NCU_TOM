"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ETLLogs } from "@/types";
import { CheckCircle2, XCircle, Clock, FileText, Database } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface PipelineTimelineProps {
  logs?: ETLLogs[];
  isLoading: boolean;
}

interface TimelineItemProps {
  log: ETLLogs;
  isLast: boolean;
}

function TimelineItem({ log, isLast }: TimelineItemProps) {
  const formattedDate = useMemo(() => {
    const date = new Date(log.created_at);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: format(date, "MMM d, yyyy 'at' HH:mm:ss"),
    };
  }, [log.created_at]);

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-slate-600 to-slate-700/50" />
      )}

      {/* Status indicator */}
      <div className="relative shrink-0">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${
              log.success
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-rose-500/20 text-rose-400"
            }
          `}
        >
          {log.success ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
        </div>
        {/* Glow effect for recent items */}
        <div
          className={`
            absolute inset-0 rounded-full blur-md opacity-30
            ${log.success ? "bg-emerald-500" : "bg-rose-500"}
          `}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-slate-200 truncate">
              {log.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`
                  inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider
                  ${
                    log.success
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }
                `}
              >
                {log.success ? "Success" : "Failed"}
              </span>
              <span className="text-xs text-slate-500">
                Observatory {log.observatory}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {formattedDate.relative}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-400">
              <span className="font-mono text-slate-300">
                {log.file_processed}
              </span>{" "}
              files
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-400">
              <span className="font-mono text-slate-300">
                {log.row_processed.toLocaleString()}
              </span>{" "}
              rows
            </span>
          </div>
        </div>

        {/* Timestamp tooltip */}
        <div className="mt-2 text-[10px] font-mono text-slate-600">
          {formattedDate.absolute}
        </div>
      </div>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="w-8 h-8 rounded-full bg-slate-700 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 bg-slate-700" />
            <Skeleton className="h-3 w-1/2 bg-slate-700" />
            <Skeleton className="h-3 w-1/3 bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PipelineTimeline({ logs, isLoading }: PipelineTimelineProps) {
  const { successRate, recentFailure } = useMemo(() => {
    if (!logs?.length) return { successRate: null, recentFailure: false };

    const successCount = logs.filter((log) => log.success).length;
    const rate = ((successCount / logs.length) * 100).toFixed(0);
    const recentFailure = logs[0] && !logs[0].success;

    return { successRate: rate, recentFailure };
  }, [logs]);

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-slate-100">
              Pipeline Activity
            </h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              ETL processing events
            </p>
          </div>

          {/* Health indicator */}
          {successRate !== null && (
            <div
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                ${
                  recentFailure
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }
              `}
            >
              <div
                className={`
                  w-1.5 h-1.5 rounded-full
                  ${recentFailure ? "bg-rose-400" : "bg-emerald-400"}
                  ${recentFailure ? "animate-pulse" : ""}
                `}
              />
              {successRate}% success
            </div>
          )}
        </div>
      </div>

      {/* Timeline content */}
      <div className="p-6">
        {isLoading ? (
          <TimelineSkeleton />
        ) : logs?.length ? (
          <div className="relative">
            {logs.map((log, index) => (
              <TimelineItem
                key={`${log.name}-${index}`}
                log={log}
                isLast={index === logs.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">No pipeline events</p>
              <p className="text-slate-600 text-xs font-mono">
                Waiting for ETL processes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
