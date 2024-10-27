"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LulinFilter } from "@/models/enums";

import { getLulinTargetData } from "@/apis/dataProducts/getLulinTargetData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMJD, formatUTC } from "@/utils/timeFormatter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DataPlot from "./DataPlot";

export default function AstronomicalObservations() {
  const [selectedObservation, setSelectedObservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [xAxisType, setXAxisType] = useState<"utc" | "mjd">("utc");

  const { data: rawData, isFetching } = useQuery({
    queryKey: ["observations"],
    queryFn: () => getLulinTargetData(0),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="container sm:max-w-[825px] lg:max-w-full py-5 grid gap-6">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Lulin Observations</h2>
          <Select
            value={xAxisType}
            onValueChange={(value: "utc" | "mjd") => setXAxisType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select x-axis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC Time</SelectItem>
              <SelectItem value="mjd">MJD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
      <section>
        <div className="mb-4">
          <Input
            placeholder="Search observations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-10 gap-4">
          {rawData && <DataPlot rawData={rawData} xAxisType={xAxisType} />}
          <div className="col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>UTC</TableHead>
                  <TableHead>MJD</TableHead>
                  <TableHead>Mag</TableHead>
                  <TableHead>Filter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rawData?.map((obs, index) => (
                  <TableRow
                    key={index}
                    className={"bg-muted hover:bg-muted/80"}
                  >
                    <TableCell>{obs.name}</TableCell>
                    <TableCell>{formatUTC(obs.obs_date)}</TableCell>
                    <TableCell>{formatMJD(obs.mjd, 3)}</TableCell>
                    <TableCell>{obs.mag.toFixed(3)}</TableCell>
                    <TableCell>{LulinFilter[obs.filter]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}
