"use client";
import PaginationItems from "@/components/Paginator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Target } from "@/models/targets";
import { columns } from "@/components/targets/columns";
import { NewTargetFrom } from "@/components/targets/createTargets";
import { DataTable } from "@/components/targets/dataTable";

interface TargetTableViewProps {
  targets: Target[];
  page: number;
  setPage: (page: number) => void;
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
  search: string;
  refetch: () => void;
}

export default function TargetTableView({
  targets,
  page,
  setPage,
  setSelectedIds,
  hasNext,
  hasPrevious,
  totalPages,
  search,
  refetch,
}: TargetTableViewProps) {
  return (
    <div className="animate-in fade-in-0 duration-300">
      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={targets}
            setSelectedIds={setSelectedIds}
          />
          {targets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {search
                  ? "No targets match your current filters"
                  : "No targets added yet"}
              </div>
              <div className="mt-4">
                <NewTargetFrom refetch={refetch} />
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
