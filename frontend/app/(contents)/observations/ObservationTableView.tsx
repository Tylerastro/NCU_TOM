"use client";
import PaginationItems from "@/components/Paginator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Observation } from "@/models/observations";
import { getColumns } from "./columns";
import { NewObservationFrom } from "./createObservation";
import { DataTable } from "./dataTable";

interface ObservationTableViewProps {
  observations: Observation[];
  page: number;
  setPage: (page: number) => void;
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
  search: string;
  searchUsers: number[];
  searchStatus: number[];
  refetch: () => void;
}

export default function ObservationTableView({
  observations,
  page,
  setPage,
  setSelectedIds,
  hasNext,
  hasPrevious,
  totalPages,
  search,
  searchUsers,
  searchStatus,
  refetch,
}: ObservationTableViewProps) {
  const hasFilters = search || searchUsers.length > 0 || searchStatus.length > 0;

  return (
    <div className="animate-in fade-in-0 duration-300">
      <Card>
        <CardContent>
          <DataTable
            columns={getColumns(refetch)}
            data={observations}
            setSelectedIds={setSelectedIds}
          />
          {observations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {hasFilters
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
                disabled={!hasPrevious}
              >
                Previous
              </Button>
            </PaginationItem>

            {PaginationItems(page, totalPages, setPage, page)}

            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() => setPage(page + 1)}
                disabled={!hasNext}
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