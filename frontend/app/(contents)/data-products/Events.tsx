"use client";
import { getETLLogs } from "@/apis/logs/getETLLogs";
import CardSkeleton from "@/components/data-products/CardSkeleton";
import EventCard from "@/components/data-products/EventCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

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

export default function Events() {
  const { data: logs, isFetching } = useQuery({
    queryKey: ["logs"],
    queryFn: () => getETLLogs(),
    refetchOnWindowFocus: false,
  });

  const emptyCardsCount = logs ? Math.max(0, 4 - logs.length) : 0;
  const emptyCards = Array(emptyCardsCount).fill(null);

  return (
    <div className="container sm:max-w-[825px] lg:max-w-full py-5 grid gap-6">
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
        {isFetching ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : null}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {logs?.map((log) => (
            <EventCard key={log.name} event={log} />
          ))}
          {emptyCards.map((_, index) => (
            <EventCard key={`empty-${index}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
