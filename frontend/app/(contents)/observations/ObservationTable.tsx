"use client";
import { deleteObservation } from "@/apis/observations/deleteObservation";
import { getObservationStats } from "@/apis/observations/getObservationStats";
import { getObservations } from "@/apis/observations/getObservations";
import { getUserList } from "@/apis/system/getUserList";
import useDebounce from "@/components/Debounce";
import { createDataHash } from "@/components/utils";
import { UserRole } from "@/models/enums";
import { Observation } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import ObservationFilter from "./ObservationFilter";
import ObservationTableView from "./ObservationTableView";

export default function ObservationTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);
  const [searchUsers, setSearchUsers] = useState<number[]>([]);
  const [searchStatus, setSearchStatus] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const session = useSession();
  const isAdmin = session?.data?.user?.role === UserRole.Admin;

  // Stable callbacks to prevent unnecessary re-renders
  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
  }, []);


  const handleSetSearchUsers = useCallback((newUsers: number[]) => {
    setSearchUsers(newUsers);
  }, []);

  const handleSetSearchStatus = useCallback((newStatus: number[]) => {
    setSearchStatus(newStatus);
  }, []);

  const handleSetSelectedIds = useCallback((value: React.SetStateAction<number[]>) => {
    setSelectedIds(value);
  }, []);

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const { data, refetch } = useQuery({
    queryKey: [
      "observations",
      page,
      debounceSearch,
      searchUsers,
      searchStatus,
    ],
    queryFn: async () => {
      try {
        const response = await getObservations({
          page,
          name: debounceSearch,
          users: searchUsers,
          status: searchStatus,
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

  // Create a hash key for triggering re-renders when data changes
  const dataKey = useMemo(() => {
    return createDataHash(observations, page, data?.count);
  }, [observations, page, data?.count]);

  return (
    <div className="space-y-6">
      <ObservationFilter
        search={search}
        setSearch={handleSetSearch}
        searchUsers={searchUsers}
        setSearchUsers={handleSetSearchUsers}
        searchStatus={searchStatus}
        setSearchStatus={handleSetSearchStatus}
        selectedIds={selectedIds}
        userFilterData={userFilterData}
        statusFilterData={statusFilterData}
        observationsCount={data?.count || 0}
        isAdmin={isAdmin}
        refetch={refetch}
        onDelete={handleDelete}
      />

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
