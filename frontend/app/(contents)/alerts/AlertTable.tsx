"use client";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/components/Debounce";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "./dataTable";
import { columns } from "./columns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import PaginationItems from "@/components/Paginator";
import { getAlerts } from "@/apis/alerts/getAlerts";
import { deleteAlert } from "@/apis/alerts/deleteAlert";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-3 py-10">
      <Skeleton className="h-[250px] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-8/12" />
        <Skeleton className="h-4 w-6/12" />
      </div>
    </div>
  );
}

export default function AlertTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);

  const { data, refetch, isFetching, isLoading } = useQuery({
    queryKey: ["alerts", page, debounceSearch],
    queryFn: async () => {
      try {
        const response = await getAlerts({
          page,
          name: debounceSearch,
        });
        return response;
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          toast.error("Please sign in to continue");
          return { results: [], count: 0, next: 0, previous: 0, total: 0 };
        }
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  const alerts = data?.results || [];

  return (
    <div className="sm:max-w-[825px] lg:max-w-full py-5">
      <div className="flex justify-between py-2 px-2 gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Filter alerts..."
            className="h-10 text-primary-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button className="h-10" onClick={() => refetch()}>
            Create broker
          </Button>
        </div>
      </div>
      {isLoading || isFetching ? (
        <LoadingSkeleton />
      ) : (
        <DataTable columns={columns} data={alerts} />
      )}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant={"ghost"}
                onClick={() => setPage(page - 1)}
                disabled={!data?.previous}
              >
                Previous
              </Button>
            </PaginationItem>
            {PaginationItems(page, data?.total || 1, setPage, page)}
            <PaginationItem>
              <Button
                variant={"ghost"}
                onClick={() => setPage(page + 1)}
                disabled={!data?.next}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
