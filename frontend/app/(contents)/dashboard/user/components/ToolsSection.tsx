"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TIMEZONES, ASTRONOMY_TOOLS, type TimezoneInfo } from "./types";

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

const ExternalLinkIcon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

function formatTimeForTimezone(tz: string): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDateForTimezone(tz: string): string {
  return new Date().toLocaleDateString("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function TimezoneConverter() {
  const [selectedTz, setSelectedTz] = useState<TimezoneInfo>(TIMEZONES[0]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [utcTime, setUtcTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(formatTimeForTimezone(selectedTz.tz));
      setCurrentDate(formatDateForTimezone(selectedTz.tz));
      setUtcTime(formatTimeForTimezone("UTC"));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [selectedTz]);

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <ClockIcon />
          </div>
          <div>
            <CardTitle className="text-base font-medium">
              Observatory Time
            </CardTitle>
            <CardDescription className="text-xs">
              Current time at different sites
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedTz.id}
          onValueChange={(id) => {
            const tz = TIMEZONES.find((t) => t.id === id);
            if (tz) setSelectedTz(tz);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.id} value={tz.id}>
                {tz.name} ({tz.offset})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-center py-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          <div className="text-3xl font-mono font-bold text-neutral-900 dark:text-neutral-100">
            {currentTime || "--:--:--"}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {currentDate}
          </div>
          <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
            {selectedTz.name}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span>UTC Reference</span>
          <span className="font-mono">{utcTime || "--:--:--"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function AstronomyTools() {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Astronomy Tools</CardTitle>
        <CardDescription className="text-xs">
          External resources and databases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {ASTRONOMY_TOOLS.map((tool) => (
            <Button
              key={tool.name}
              asChild
              variant="outline"
              className="h-auto py-3 px-3 flex flex-col items-start gap-1"
            >
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-1.5 w-full">
                  <span className="text-sm font-medium">{tool.name}</span>
                  <ExternalLinkIcon />
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                  {tool.description}
                </span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ToolsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TimezoneConverter />
      <AstronomyTools />
    </div>
  );
}
