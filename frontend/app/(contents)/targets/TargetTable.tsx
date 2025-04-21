"use client";
import { getTags } from "@/apis/tags/getTags";
import { deleteTargets } from "@/apis/targets/deleteTargets";
import { getTargets } from "@/apis/targets/getTargets";
import useDebounce from "@/components/Debounce";
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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { columns } from "@/components/targets/columns";
import { NewTargetFrom } from "@/components/targets/createTargets";
import { DataTable } from "@/components/targets/dataTable";

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

export default function TargetTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);
  const [searchTags, setSearchTags] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["targets", page, debounceSearch, searchTags],
    queryFn: async () => {
      try {
        const response = await getTargets({
          page,
          name: search,
          tags: searchTags,
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

  const { data: tagData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (ids: number[]) => {
    try {
      const response = await deleteTargets(ids);
      await refetch();
      toast.success(response.message || "Targets deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const targets = data?.results as Target[];

  const TagFilterData =
    tagData
      ?.filter((tag) => tag.targets.length > 0)
      .map((tag) => ({
        label: tag.name,
        value: tag.targets.length,
        id: tag.id || 0,
      })) || [];

  useEffect(() => {
    setPage(1);
  }, [search, searchTags]);

  return (
    <div className="sm:max-w-[825px] lg:max-w-full py-5">
      <div className="flex justify-between py-2 px-2 gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Filter targets..."
            className="h-10 text-primary-foreground "
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchFilter
            title="Tags"
            data={TagFilterData}
            setData={setSearchTags}
          />
        </div>
        <div className="flex gap-2">
          <NewTargetFrom refetch={refetch} />
          <Button
            variant="outline"
            size={"lg"}
            disabled={selectedIds.length === 0}
            className=" dark:bg-red-800/100 dark:hover:bg-red-500/70"
            onClick={() => handleDelete(selectedIds.map((id) => id))}
          >
            Delete
          </Button>
        </div>
      </div>

      {isFetching || !targets ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={targets}
          setSelectedIds={setSelectedIds}
        />
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
