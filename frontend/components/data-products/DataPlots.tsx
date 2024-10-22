"use client";

import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data (replace with your actual data)
const observations = [
  {
    id: 1,
    ra: 10.5,
    dec: -20.3,
    magnitude: 15.2,
    exposureTime: 300,
    filter: "V",
  },
  {
    id: 2,
    ra: 15.2,
    dec: 30.1,
    magnitude: 12.8,
    exposureTime: 450,
    filter: "R",
  },
  {
    id: 3,
    ra: 5.7,
    dec: 10.5,
    magnitude: 18.1,
    exposureTime: 600,
    filter: "B",
  },
  {
    id: 4,
    ra: 20.1,
    dec: -15.8,
    magnitude: 14.5,
    exposureTime: 300,
    filter: "I",
  },
  { id: 5, ra: 8.9, dec: 5.2, magnitude: 16.7, exposureTime: 450, filter: "U" },
];

export default function AstronomicalObservations() {
  const [selectedObservation, setSelectedObservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredObservations = observations.filter(
    (obs) =>
      obs.id.toString().includes(searchTerm) ||
      obs.ra.toString().includes(searchTerm) ||
      obs.dec.toString().includes(searchTerm) ||
      obs.magnitude.toString().includes(searchTerm) ||
      obs.filter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 grid gap-6">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Astronomical Observations</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartContainer
            config={{
              observations: {
                label: "Observations",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <XAxis
                  type="number"
                  dataKey="ra"
                  name="Right Ascension"
                  unit="°"
                />
                <YAxis
                  type="number"
                  dataKey="dec"
                  name="Declination"
                  unit="°"
                />
                <ZAxis
                  type="number"
                  dataKey="magnitude"
                  range={[50, 400]}
                  name="Magnitude"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Scatter
                  name="Observations"
                  data={filteredObservations}
                  fill="var(--color-observations)"
                  onClick={(data) => setSelectedObservation(data)}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>RA</TableHead>
                <TableHead>Dec</TableHead>
                <TableHead>Magnitude</TableHead>
                <TableHead>Exposure</TableHead>
                <TableHead>Filter</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObservations.map((obs) => (
                <TableRow
                  key={obs.id}
                  className={
                    selectedObservation && selectedObservation.id === obs.id
                      ? "bg-muted"
                      : ""
                  }
                >
                  <TableCell>{obs.id}</TableCell>
                  <TableCell>{obs.ra.toFixed(2)}°</TableCell>
                  <TableCell>{obs.dec.toFixed(2)}°</TableCell>
                  <TableCell>{obs.magnitude.toFixed(1)}</TableCell>
                  <TableCell>{obs.exposureTime}s</TableCell>
                  <TableCell>{obs.filter}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
