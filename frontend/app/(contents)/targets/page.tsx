"use client";
import { getTags } from "@/apis/tags/getTags";
import { deleteBulkTarget } from "@/apis/targets/bulkTargetDelete";
import { getTargets } from "@/apis/targets/getTargets";
import PaginationItems from "@/components/Paginator";
import SearchFilter from "@/components/SearchFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "@/models/targets";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { columns } from "./columns";
import { NewTargetFrom } from "./createTargets";
import { DataTable } from "./dataTable";

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
  const [search, setSearch] = useState("");
  const [searchTags, setSearchTags] = useState<number[]>([]);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["targets", page, search, searchTags],
    queryFn: () => getTargets(page, search, searchTags),
    refetchOnWindowFocus: false,
  });

  const { data: tagData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
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

  const TagFilterData =
    tagData?.map((tag) => {
      return {
        label: tag.name,
        value: tag.targets.length,
        id: tag.id || 0,
      };
    }) || [];

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
        <Input
          placeholder="Filter targets..."
          className="text-primary-foreground h-8 w-[150px] lg:w-[250px]"
          onChange={(e) => setSearch(e.target.value)}
        />
        <SearchFilter
          title="Tags"
          data={TagFilterData}
          setData={setSearchTags}
        />
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
    </>
  );
}
