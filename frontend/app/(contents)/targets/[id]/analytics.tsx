import { getLulinTargetData } from "@/apis/dataProducts/getLulinTargetData";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TabsContent } from "@/components/ui/tabs";
import { LulinFilter } from "@/models/enums";
import { formatMJD, formatUTC } from "@/utils/timeFormatter";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { addDays, format, subDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";

// Define filter colors with proper typing
const FILTER_COLORS: Record<number, string> = {
  [LulinFilter.u]: "#8884d8", // purple for u
  [LulinFilter.g]: "#4CAF50", // green for g
  [LulinFilter.r]: "#FF5252", // red for r
  [LulinFilter.i]: "#FF9800", // orange for i
  [LulinFilter.z]: "#607D8B", // blue-grey for z
};

// Amount of padding to add to date range (in days)
const DATE_PADDING = 3;

export default function Analytics({ targetId }: { targetId: number }) {
  const { data: rawData, isFetching } = useQuery({
    queryKey: ["observations"],
    queryFn: () => getLulinTargetData(targetId),
    refetchOnWindowFocus: false,
  });

  // State for filter visibility
  const [visibleFilters, setVisibleFilters] = useState<Record<number, boolean>>(
    {}
  );

  // State for date range selection with proper DateRange type
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const { processedData, uniqueFilters, dateExtent } = useMemo(() => {
    if (isFetching || !rawData || rawData.length === 0)
      return {
        processedData: [],
        uniqueFilters: [] as number[],
        dateExtent: undefined, // Return undefined initially
      };

    // Get unique filters
    const filters = Array.from(new Set(rawData.map((obs) => obs.filter)));

    // Get date range of data
    const dates = rawData.map((obs) => new Date(obs.obs_date));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const processed = rawData.map((obs) => ({
      ...obs,
      obs_date_ms: new Date(obs.obs_date).getTime(),
      filterColor: FILTER_COLORS[obs.filter] || "#000000", // Fallback color if filter not found
    }));

    return {
      processedData: processed,
      uniqueFilters: filters,
      dateExtent: { min: minDate, max: maxDate },
    };
    // Remove visibleFilters and dateRange from dependencies as they are not directly used for calculation here
  }, [rawData, isFetching]);

  // Effect to initialize filters when uniqueFilters are determined
  useEffect(() => {
    if (uniqueFilters.length > 0 && Object.keys(visibleFilters).length === 0) {
      const initialFilters: Record<number, boolean> = {};
      uniqueFilters.forEach((filter) => {
        initialFilters[filter] = true;
      });
      setVisibleFilters(initialFilters);
    }
  }, [uniqueFilters, visibleFilters]); // Add visibleFilters to dependency to ensure it only runs when empty

  // Effect to initialize date range when dateExtent is determined
  useEffect(() => {
    if (dateExtent && !dateRange?.from && !dateRange?.to) {
      // Default to show the past 30 days of data or all data if less than 30 days
      const thirtyDaysAgo = subDays(dateExtent.max, 30);
      const defaultFrom =
        dateExtent.min > thirtyDaysAgo ? dateExtent.min : thirtyDaysAgo;
      setDateRange({
        from: defaultFrom,
        to: dateExtent.max,
      });
    }
    // Only depend on dateExtent, as dateRange check prevents re-running if already set
  }, [dateExtent]);

  // Handle filter checkbox change
  const handleFilterChange = (filter: number) => {
    setVisibleFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  if (rawData === undefined || rawData.length === 0) {
    return (
      <TabsContent value="analytics">
        <div className="text-center">
          <p className="text-3xl font-bold">No data</p>
        </div>
      </TabsContent>
    );
  }

  // Filter data based on visibility selections and date range
  const filteredData = processedData.filter((obs) => {
    // Early return if filters aren't initialized yet
    if (Object.keys(visibleFilters).length === 0) return false;

    const obsDate = new Date(obs.obs_date);
    const isFilterVisible = visibleFilters[obs.filter];
    const isInDateRange =
      (!dateRange?.from || obsDate >= dateRange.from) &&
      (!dateRange?.to || obsDate <= dateRange.to);

    return isFilterVisible && isInDateRange;
  });

  // Helper function to safely get filter name
  const getFilterName = (filter: number): string => {
    return (LulinFilter[filter] as string) || `Unknown (${filter})`;
  };

  // Calculate axis domain with padding
  const getAxisDomain = () => {
    if (dateRange?.from && dateRange?.to) {
      const paddedFrom = subDays(dateRange.from, DATE_PADDING).getTime();
      const paddedTo = addDays(dateRange.to, DATE_PADDING).getTime();
      return [paddedFrom, paddedTo];
    }
    return ["auto", "auto"];
  };

  // Add loading state check
  if (isFetching || !dateExtent || Object.keys(visibleFilters).length === 0) {
    return (
      <TabsContent value="analytics">
        <div className="flex justify-center items-center h-64">
          <p>Loading analytics data...</p> {/* Or a spinner component */}
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="analytics">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-3">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Filter Options</h3>

            {/* Date Range Picker */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Date Range</h4>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={!dateExtent} // Disable calendar if dateExtent not ready
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (dateExtent) {
                        // Check if dateExtent is available
                        setDateRange({
                          from: subDays(dateExtent.max, 7),
                          to: dateExtent.max,
                        });
                      }
                    }}
                    disabled={!dateExtent} // Disable button if dateExtent not ready
                  >
                    Last 7 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (dateExtent) {
                        // Check if dateExtent is available
                        setDateRange({
                          from: subDays(dateExtent.max, 30),
                          to: dateExtent.max,
                        });
                      }
                    }}
                    disabled={!dateExtent} // Disable button if dateExtent not ready
                  >
                    Last 30 days
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (dateExtent) {
                      // Check if dateExtent is available
                      setDateRange({
                        from: dateExtent.min,
                        to: dateExtent.max,
                      });
                    }
                  }}
                  disabled={!dateExtent} // Disable button if dateExtent not ready
                >
                  All time
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div>
              <h4 className="text-sm font-medium mb-2">Filters</h4>
              <div className="space-y-2">
                {uniqueFilters.map((filter) => (
                  <div key={filter} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${filter}`}
                      checked={visibleFilters[filter]}
                      onCheckedChange={() => handleFilterChange(filter)}
                      className="border-gray-400"
                      disabled={isFetching} // Optional: disable while fetching
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: FILTER_COLORS[filter] || "#000000",
                      }}
                    />
                    <Label
                      htmlFor={`filter-${filter}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {getFilterName(filter)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <ChartContainer
            config={{
              ...Object.fromEntries(
                Object.entries(LulinFilter)
                  .filter(([key]) => !isNaN(Number(key)))
                  .map(([key, value]) => [
                    `filter-${key}`,
                    {
                      label: `Filter: ${value}`,
                      color: FILTER_COLORS[Number(key)] || "#000000",
                    },
                  ])
              ),
            }}
            className="min-h-[400px]"
          >
            <ResponsiveContainer>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              >
                <XAxis
                  type="number"
                  dataKey="obs_date_ms"
                  name="UTC"
                  tickFormatter={(value) => formatUTC(value)}
                  domain={getAxisDomain()}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  type="number"
                  dataKey="mag"
                  name="Magnitude"
                  unit=""
                  reversed
                  domain={["auto", "auto"]}
                />
                <Legend
                  verticalAlign="top"
                  fontSize={"12rem"}
                  wrapperStyle={{ color: "#fff" }}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded p-2">
                          <p className="font-bold">{data.name}</p>
                          <p>
                            UTC: {formatUTC(data.obs_date, "MM-dd HH:mm:ss")}
                          </p>
                          <p>MJD: {formatMJD(data.mjd, 3)}</p>
                          <p>Magnitude: {data.mag.toFixed(3)}</p>
                          <p style={{ color: data.filterColor }}>
                            Filter: {getFilterName(data.filter)}
                          </p>
                          <p>Exposure: {data.exposure_time}s</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {uniqueFilters
                  .filter((filter) => visibleFilters[filter])
                  .map((filter) => (
                    <Scatter
                      key={`filter-${filter}`}
                      name={getFilterName(filter)}
                      data={filteredData.filter((obs) => obs.filter === filter)}
                      fill={FILTER_COLORS[filter] || "#000000"}
                      shape="circle" // Ensure a shape is specified
                    />
                  ))}
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </TabsContent>
  );
}
