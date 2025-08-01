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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Search, Filter, Trash2 } from "lucide-react";
import { columns } from "./columns";
import { NewObservationFrom } from "./createObservation";
import { DataTable } from "./dataTable";

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ObservationTable() {
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

  if (isLoading || !observations) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter and search through your {data?.count || 0} observations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search observations, targets, or notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
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
            <div className="flex gap-2">
              <NewObservationFrom refetch={refetch} />
              <Button
                variant="destructive"
                size="default"
                disabled={selectedIds.length === 0}
                onClick={() => handleDelete(selectedIds.map((id) => id))}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedIds.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={observations}
            setSelectedIds={setSelectedIds}
          />
          {observations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {search ||
                searchTags.length > 0 ||
                searchUsers.length > 0 ||
                searchStatus.length > 0
                  ? "No observations match your current filters"
                  : "No observations added yet"}
              </div>
              <div className="mt-4">
                <NewObservationFrom refetch={refetch} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
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
                variant="ghost"
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
    </div>
  );
}
