"use client";
import {
  deleteObservation,
  getObservationStats,
  getObservations,
} from "@/apis/observations";
import { getUserList } from "@/apis/system";
import useDebounce from "@/components/Debounce";
import SearchFilter from "@/components/SearchFilter";
import { createDataHash } from "@/components/utils";
import { UserRole } from "@/models/enums";
import { Observation } from "@/models/observations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import ObservationTableView from "./ObservationTableView";
import { NewObservationFrom } from "./createObservation";

export default function ObservationTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);
  const [searchUsers, setSearchUsers] = useState<number[]>([]);
  const [searchStatus, setSearchStatus] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const session = useSession();
  const isAdmin = session?.data?.user?.role === UserRole.Admin;

  const handleSetSelectedIds = useCallback(
    (value: React.SetStateAction<number[]>) => {
      setSelectedIds(value);
    },
    []
  );

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const { data, refetch } = useQuery({
    queryKey: ["observations", page, debounceSearch, searchUsers, searchStatus],
    queryFn: () =>
      getObservations({
        page,
        name: debounceSearch,
        users: searchUsers,
        status: searchStatus,
      }),
    refetchOnWindowFocus: false,
  });

  const { data: userData } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUserList(),
    refetchOnWindowFocus: false,
    enabled: isAdmin,
  });

  const { data: observationStats } = useQuery({
    queryKey: ["observationStats"],
    queryFn: () => getObservationStats(),
    refetchOnWindowFocus: false,
  });

  const handleDelete = useCallback(
    async (ids: number[]) => {
      try {
        const response = await deleteObservation(ids);
        await refetch();
        toast.success(response.message || "Observations deleted successfully");
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    },
    [refetch]
  );

  const statusFilterData = useMemo(
    () =>
      observationStats?.status_counts.map((status) => ({
        label: status.name,
        value: status.count,
        id: status.id,
      })) || [],
    [observationStats]
  );

  const userFilterData = useMemo(
    () =>
      isAdmin
        ? userData?.map((user) => ({
            label: user.username,
            value: user.observations?.length || 0,
            id: user.id || 0,
          })) || []
        : [],
    [userData, isAdmin]
  );

  useEffect(() => {
    setPage(1);
  }, [search, searchUsers, searchStatus]);

  const observations = data?.results as Observation[];

  const dataKey = useMemo(() => {
    return createDataHash(observations, page, data?.count);
  }, [observations, page, data?.count]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Observations</h1>
        <NewObservationFrom refetch={refetch} />
      </div>

      <p className="text-sm text-muted-foreground">
        {data?.count ?? 0} observations
      </p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search observations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {isAdmin && (
          <SearchFilter
            title="Users"
            data={userFilterData}
            setData={setSearchUsers}
          />
        )}
        <SearchFilter
          title="Status"
          data={statusFilterData}
          setData={setSearchStatus}
        />

        <Button
          variant="destructive"
          size="default"
          onClick={() => handleDelete(selectedIds)}
          className={`gap-2 transition-opacity ${
            selectedIds.length > 0
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          Delete ({selectedIds.length})
        </Button>
      </div>

      {observations && (
        <ObservationTableView
          key={dataKey}
          observations={observations}
          page={page}
          setPage={handleSetPage}
          setSelectedIds={handleSetSelectedIds}
          hasNext={!!data?.next}
          hasPrevious={!!data?.previous}
          totalPages={data?.total || 1}
          search={search}
          searchUsers={searchUsers}
          searchStatus={searchStatus}
          refetch={refetch}
        />
      )}
    </div>
  );
}
