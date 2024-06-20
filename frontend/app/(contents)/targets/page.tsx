"use client";
import { deleteBulkTarget } from "@/apis/targets/bulkTargetDelete";
import { getTargets } from "@/apis/targets/getTargets";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "@/models/targets";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { Paginator } from "@/models/helpers";
import { NewTargetFrom } from "./createTargets";
import { DataTable } from "./dataTable";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useState } from "react";

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

export default function TargetsTable() {
  const [page, setPage] = useState(1);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["targets", page],
    queryFn: () => getTargets(page),
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (ids: number[]) => {
    try {
      await deleteBulkTarget(ids);
      await refetch();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const targets = data?.results as Target[];

  const getPaginationItems = () => {
    const currentPage = page;
    const totalPages = data?.total || 1;

    const startPage = Math.max(currentPage - 1, 1);
    const endPage = Math.min(currentPage + 1, totalPages);

    const paginationItems = [];
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <Button
            variant={i === currentPage ? "outline" : "ghost"}
            onClick={() => setPage(i)}
          >
            {i}
          </Button>
        </PaginationItem>
      );
    }

    return paginationItems;
  };

  return (
    <>
      <div className="flex space-between justify-between pb-2">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            Targets
          </h1>
        </div>

        <div className="flex gap-2">
          <NewTargetFrom refetch={refetch} />
        </div>
      </div>

      <div className="container px-0 sm:max-w-[825px] lg:max-w-full  py-10">
        {isFetching || !targets ? (
          <LoadingSkeleton />
        ) : (
          <DataTable columns={columns} data={targets} onDelete={handleDelete} />
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

              {getPaginationItems()}

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
    </>
  );
}
