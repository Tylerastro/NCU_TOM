"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LulinDataProduct } from "@/types";
import { LulinFilter, LulinInstrument } from "@/types/enums";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, AlertCircle, Star } from "lucide-react";
import Link from "next/link";

interface RecentDataTableProps {
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
  [LulinFilter.u]: "u",
  [LulinFilter.g]: "g",
  [LulinFilter.r]: "r",
  [LulinFilter.i]: "i",
  [LulinFilter.z]: "z",
};

const INSTRUMENT_LABELS: Record<number, string> = {
  [LulinInstrument.LOT]: "LOT",
  [LulinInstrument.SLT]: "SLT",
  [LulinInstrument.TRIPOL]: "TRIPOL",
};

type SortField = "obs_date" | "mag" | "FWHM" | "target";
type SortDirection = "asc" | "desc";

function SortButton({
  field,
  currentField,
  direction,
  onClick,
  children,
}: {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onClick: (field: SortField) => void;
  children: React.ReactNode;
}) {
  const isActive = field === currentField;

  return (
    <button
      onClick={() => onClick(field)}
      className="flex items-center gap-1 hover:text-slate-200 transition-colors"
    >
      {children}
      {isActive && (
        <span className="text-cyan-400">
          {direction === "asc" ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </span>
      )}
    </button>
  );
}

export function RecentDataTable({ data, isLoading }: RecentDataTableProps) {
  const [sortField, setSortField] = useState<SortField>("obs_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedData = useMemo(() => {
    if (!data?.length) return [];

    const sorted = [...data].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortField) {
        case "obs_date":
          aVal = new Date(a.obs_date).getTime();
          bVal = new Date(b.obs_date).getTime();
          break;
        case "mag":
          aVal = a.mag;
          bVal = b.mag;
          break;
        case "FWHM":
          aVal = a.FWHM;
          bVal = b.FWHM;
          break;
        case "target":
          aVal = a.target?.name || "";
          bVal = b.target?.name || "";
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted.slice(0, 10);
  }, [data, sortField, sortDirection]);

  // Detect anomalies (high FWHM or unusual magnitude)
  const anomalyThreshold = useMemo(() => {
    if (!data?.length) return { fwhm: Infinity, magStd: 0 };

    const fwhmValues = data.map((d) => d.FWHM);
    const avgFwhm =
      fwhmValues.reduce((a, b) => a + b, 0) / fwhmValues.length;
    const fwhmStd = Math.sqrt(
      fwhmValues.reduce((sum, v) => sum + Math.pow(v - avgFwhm, 2), 0) /
        fwhmValues.length
    );

    return {
      fwhm: avgFwhm + 2 * fwhmStd,
      magStd: 2,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        <div className="border-b border-slate-700/50 px-6 py-4">
          <Skeleton className="h-6 w-40 bg-slate-700" />
        </div>
        <div className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full bg-slate-800/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-slate-100">
              Recent Data Points
            </h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Latest photometry measurements
            </p>
          </div>
          {data && data.length > 10 && (
            <span className="text-xs text-slate-500">
              Showing 10 of {data.length}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {sortedData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-transparent">
                <TableHead className="text-slate-400 font-mono text-xs">
                  <SortButton
                    field="target"
                    currentField={sortField}
                    direction={sortDirection}
                    onClick={handleSort}
                  >
                    Target
                  </SortButton>
                </TableHead>
                <TableHead className="text-slate-400 font-mono text-xs">
                  Filter
                </TableHead>
                <TableHead className="text-slate-400 font-mono text-xs">
                  <SortButton
                    field="mag"
                    currentField={sortField}
                    direction={sortDirection}
                    onClick={handleSort}
                  >
                    Mag
                  </SortButton>
                </TableHead>
                <TableHead className="text-slate-400 font-mono text-xs">
                  <SortButton
                    field="FWHM"
                    currentField={sortField}
                    direction={sortDirection}
                    onClick={handleSort}
                  >
                    FWHM
                  </SortButton>
                </TableHead>
                <TableHead className="text-slate-400 font-mono text-xs">
                  Inst
                </TableHead>
                <TableHead className="text-slate-400 font-mono text-xs text-right">
                  <SortButton
                    field="obs_date"
                    currentField={sortField}
                    direction={sortDirection}
                    onClick={handleSort}
                  >
                    Date
                  </SortButton>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => {
                const isAnomalyFwhm = item.FWHM > anomalyThreshold.fwhm;

                return (
                  <TableRow
                    key={`${item.name}-${index}`}
                    className={`
                      border-slate-700/30 transition-colors
                      ${isAnomalyFwhm ? "bg-amber-500/5" : "hover:bg-slate-800/30"}
                    `}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.target?.id ? (
                          <Link
                            href={`/targets/${item.target.id}`}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            {item.target.name}
                          </Link>
                        ) : (
                          <span className="text-slate-300">{item.name}</span>
                        )}
                        {isAnomalyFwhm && (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono"
                        style={{
                          backgroundColor: `${FILTER_COLORS[item.filter]}15`,
                          color: FILTER_COLORS[item.filter],
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: FILTER_COLORS[item.filter] }}
                        />
                        {FILTER_LABELS[item.filter] || item.filter}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-slate-300 tabular-nums">
                      {item.mag.toFixed(3)}
                    </TableCell>
                    <TableCell
                      className={`font-mono tabular-nums ${
                        isAnomalyFwhm ? "text-amber-400" : "text-slate-300"
                      }`}
                    >
                      {item.FWHM.toFixed(2)}″
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs">
                      {INSTRUMENT_LABELS[item.instrument] || item.instrument}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-slate-500">
                      {format(new Date(item.obs_date), "MMM d, HH:mm")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center">
                <Star className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">No data points available</p>
              <p className="text-slate-600 text-xs font-mono">
                Data will appear after observations
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with anomaly indicator */}
      {sortedData.some((d) => d.FWHM > anomalyThreshold.fwhm) && (
        <div className="border-t border-slate-700/50 px-6 py-3 bg-amber-500/5">
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              Anomalous FWHM detected - possible poor seeing conditions
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
