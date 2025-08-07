"use client";
import { deleteTargets } from "@/apis/targets/deleteTargets";
import { getTargets } from "@/apis/targets/getTargets";
import useDebounce from "@/components/Debounce";
import { createDataHash } from "@/components/utils";
import { Target } from "@/models/targets";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import TargetFilter from "./TargetFilter";
import TargetTableView from "./TargetTableView";

export default function TargetTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Stable callbacks to prevent unnecessary re-renders
  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
  }, []);


  const handleSetSelectedIds = useCallback((value: React.SetStateAction<number[]>) => {
    setSelectedIds(value);
  }, []);

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["targets", page, debounceSearch],
    queryFn: async () => {
      try {
        const response = await getTargets({
          page,
          name: search,
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


  const handleDelete = useCallback(
    async (ids: number[]) => {
      try {
        const response = await deleteTargets(ids);
        await refetch();
        toast.success(response.message || "Targets deleted successfully");
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    },
    [refetch]
  );


  useEffect(() => {
    setPage(1);
  }, [search]);

  const targets = data?.results as Target[];

  // Create a hash key for triggering re-renders when data changes
  const dataKey = useMemo(() => {
    return createDataHash(targets, page, data?.count);
  }, [targets, page, data?.count]);

  return (
    <div className="space-y-6">
      <TargetFilter
        search={search}
        setSearch={handleSetSearch}
        selectedIds={selectedIds}
        targetsCount={data?.count || 0}
        refetch={refetch}
        onDelete={handleDelete}
      />

      {targets && (
        <TargetTableView
          key={dataKey}
          targets={targets}
          page={page}
          setPage={handleSetPage}
          setSelectedIds={handleSetSelectedIds}
          hasNext={!!data?.next}
          hasPrevious={!!data?.previous}
          totalPages={data?.total || 1}
          search={search}
          refetch={refetch}
        />
      )}
    </div>
  );
}
