import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
export default function Events() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 grid gap-6">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Events</h2>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FilterIcon className="w-4 h-4" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  System events
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Recently Added
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Alphabetical
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="#"
              className="text-sm text-primary-foreground"
              prefetch={false}
            >
              View All
            </Link>
          </div>
        </div>
      </section>
      <section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption</CardTitle>
              <CardDescription>
                A dataset on global energy consumption and production.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Updated 1 month ago
                </div>
                <Link href="#" className="text-primary" prefetch={false}>
                  View Dataset
                </Link>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Education Statistics</CardTitle>
              <CardDescription>
                A dataset on global education statistics and trends.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Updated 2 months ago
                </div>
                <Link href="#" className="text-primary" prefetch={false}>
                  View Dataset
                </Link>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Healthcare Indicators</CardTitle>
              <CardDescription>
                A dataset on global healthcare indicators and trends.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Updated 3 months ago
                </div>
                <Link href="#" className="text-primary" prefetch={false}>
                  View Dataset
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
