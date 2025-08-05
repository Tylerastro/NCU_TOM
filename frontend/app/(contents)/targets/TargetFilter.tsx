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
import { NewTargetFrom } from "@/components/targets/createTargets";
import { Search, Filter, Trash2 } from "lucide-react";

interface TargetFilterProps {
  search: string;
  setSearch: (search: string) => void;
  searchTags: number[];
  setSearchTags: (tags: number[]) => void;
  selectedIds: number[];
  tagFilterData: Array<{ label: string; value: number; id: number }>;
  targetsCount: number;
  refetch: () => void;
  onDelete: (ids: number[]) => void;
}

export default function TargetFilter({
  search,
  setSearch,
  searchTags,
  setSearchTags,
  selectedIds,
  tagFilterData,
  targetsCount,
  refetch,
  onDelete,
}: TargetFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters & Search
        </CardTitle>
        <CardDescription>
          Filter and search through your {targetsCount} targets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search targets, coordinates, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <SearchFilter
            title="Tags"
            data={tagFilterData}
            setData={setSearchTags}
          />
          <div className="flex gap-2">
            <NewTargetFrom refetch={refetch} />
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
