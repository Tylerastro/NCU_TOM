"use client";
import { deleteObservation } from "@/apis/observations/deleteObservation";
import { getObservationStats } from "@/apis/observations/getObservationStats";
import { getObservations } from "@/apis/observations/getObservations";
import { getUserList } from "@/apis/system/getUserList";
import { getTags } from "@/apis/tags/getTags";
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
import { UserRole } from "@/models/enums";
import { Observation } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import { NewObservationFrom } from "./createObservation";
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

export default function ObservationsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);
  const [searchTags, setSearchTags] = useState<number[]>([]);
  const [searchUsers, setSearchUsers] = useState<number[]>([]);
  const [searchStatus, setSearchStatus] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const session = useSession();
  const isAdmin = session?.data?.user?.role === UserRole.Admin;

  const {
    data,
    refetch,
    isFetching: isFetchingData,
  } = useQuery({
    queryKey: [
      "observations",
      page,
      debounceSearch,
      searchTags,
      searchUsers,
      searchStatus,
    ],
    queryFn: async () => {
      try {
        const response = await getObservations({
          page,
          name: debounceSearch,
          tags: searchTags,
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
  });

  const { data: tagData, isFetching: tagIsFetching } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
    refetchOnWindowFocus: false,
    enabled: !!session && !!session.data,
  });

  const { data: userData, isFetching: userIsFetching } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUserList(),
    refetchOnWindowFocus: false,
    enabled: isAdmin,
  });

  const { data: observationStats, isFetching: observationStatIsFetching } =
    useQuery({
      queryKey: ["observationStats"],
      queryFn: () => getObservationStats(),
      refetchOnWindowFocus: false,
      enabled: !!session && !!session.data,
    });

  const handleDelete = async (ids: number[]) => {
    try {
      const response = await deleteObservation(ids);
      await refetch();
      toast.success(response.message || "Observations deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const observations = data?.results as Observation[];

  const TagFilterData =
    tagData
      ?.filter((tag) => tag.observations.length > 0)
      ?.map((tag) => {
        return {
          label: tag.name,
          value: tag.observations.length,
          id: tag.id || 0,
        };
      }) || [];

  const StatusFilterData =
    observationStats?.status_counts.map((status) => {
      return {
        label: status.name,
        value: status.count,
        id: status.id,
      };
    }) || [];

  const UserFilterData = isAdmin
    ? userData?.map((user) => ({
        label: user.username,
        value: user.observations?.length || 0,
        id: user.id || 0,
      })) || []
    : [];

  useEffect(() => {
    setIsLoading(isFetchingData || userIsFetching || observationStatIsFetching);
  }, [isFetchingData, userIsFetching, observationStatIsFetching]);

  useEffect(() => {
    setPage(1);
  }, [search, searchTags, searchUsers, searchStatus]);

  return (
    <>
      <div className="flex space-between justify-between pb-2">
        <div>
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
            Observations
          </h1>
        </div>

        <div className="flex gap-2">
          <NewObservationFrom refetch={refetch} />
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

      <div className="container px-0 sm:max-w-[825px] lg:max-w-full  py-10">
        <div className="flex space-between py-2 px-2 gap-2">
          <Input
            placeholder="Filter observations..."
            className="text-primary-foreground h-10 w-[150px] lg:w-[250px]"
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchFilter
            title="Tags"
            data={TagFilterData}
            setData={setSearchTags}
          />
          {isAdmin && (
            <SearchFilter
              title="Users"
              data={UserFilterData}
              setData={setSearchUsers}
            />
          )}
          <SearchFilter
            title="Status"
            data={StatusFilterData}
            setData={setSearchStatus}
          />
        </div>
        {isLoading || !observations ? (
          <LoadingSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={observations}
            setSelectedIds={setSelectedIds}
          />
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant={"ghost"}
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || !data?.previous}
                aria-label="Previous Page"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setPage(page - 1);
                }}
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
                aria-label="Next Page"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setPage(page + 1);
                }}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
