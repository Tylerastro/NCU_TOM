"use client";
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
import { NewObservationFrom } from "./createObservation";
import { Search, Filter, Trash2 } from "lucide-react";

interface ObservationFilterProps {
  search: string;
  setSearch: (search: string) => void;
  searchTags: number[];
  setSearchTags: (tags: number[]) => void;
  searchUsers: number[];
  setSearchUsers: (users: number[]) => void;
  searchStatus: number[];
  setSearchStatus: (status: number[]) => void;
  selectedIds: number[];
  tagFilterData: Array<{ label: string; value: number; id: number }>;
  userFilterData: Array<{ label: string; value: number; id: number }>;
  statusFilterData: Array<{ label: string; value: number; id: number }>;
  observationsCount: number;
  isAdmin: boolean;
  refetch: () => void;
  onDelete: (ids: number[]) => void;
}

export default function ObservationFilter({
  search,
  setSearch,
  searchTags,
  setSearchTags,
  searchUsers,
  setSearchUsers,
  searchStatus,
  setSearchStatus,
  selectedIds,
  tagFilterData,
  userFilterData,
  statusFilterData,
  observationsCount,
  isAdmin,
  refetch,
  onDelete,
}: ObservationFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters & Search
        </CardTitle>
        <CardDescription>
          Filter and search through your {observationsCount} observations
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
              data={tagFilterData}
              setData={setSearchTags}
            />
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
          </div>
          <div className="flex gap-2">
            <NewObservationFrom refetch={refetch} />
            <Button
              variant="destructive"
              size="default"
              disabled={selectedIds.length === 0}
              onClick={() => onDelete(selectedIds)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedIds.length})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}