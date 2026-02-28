"use client";
import { deleteTargets, getTargets } from "@/apis/targets";
import useDebounce from "@/components/Debounce";
import { createDataHash } from "@/components/utils";
import { Target } from "@/models/targets";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import TargetTableView from "./TargetTableView";
import { NewTargetFrom } from "@/components/targets/createTargets";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from "lucide-react";

function useNumericInput(initial: string = "") {
  const [raw, setRaw] = useState(initial);
  const debounced = useDebounce(raw, 300);
  const value = debounced === "" ? undefined : Number(debounced);
  return { raw, setRaw, value };
}

export default function TargetTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const raMin = useNumericInput();
  const raMax = useNumericInput();
  const decMin = useNumericInput();
  const decMax = useNumericInput();

  const handleSetSelectedIds = useCallback(
    (value: React.SetStateAction<number[]>) => {
      setSelectedIds(value);
    },
    []
  );

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const { data, refetch, isFetching } = useQuery({
    queryKey: [
      "targets",
      page,
      debounceSearch,
      raMin.value,
      raMax.value,
      decMin.value,
      decMax.value,
    ],
    queryFn: () =>
      getTargets({
        page,
        name: debounceSearch,
        raMin: raMin.value,
        raMax: raMax.value,
        decMin: decMin.value,
        decMax: decMax.value,
      }),
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
  }, [
    search,
    raMin.value,
    raMax.value,
    decMin.value,
    decMax.value,
  ]);

  const targets = data?.results as Target[];

  const dataKey = useMemo(() => {
    return createDataHash(targets, page, data?.count);
  }, [targets, page, data?.count]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Targets</h1>
        <NewTargetFrom refetch={refetch} />
      </div>

      <p className="text-sm text-muted-foreground">
        {data?.count ?? 0} targets
      </p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search targets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">RA</span>
          <Input
            type="number"
            placeholder="Min"
            value={raMin.raw}
            onChange={(e) => raMin.setRaw(e.target.value)}
            className="w-24"
            min={0}
            max={360}
            step="any"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={raMax.raw}
            onChange={(e) => raMax.setRaw(e.target.value)}
            className="w-24"
            min={0}
            max={360}
            step="any"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Dec</span>
          <Input
            type="number"
            placeholder="Min"
            value={decMin.raw}
            onChange={(e) => decMin.setRaw(e.target.value)}
            className="w-24"
            min={-90}
            max={90}
            step="any"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={decMax.raw}
            onChange={(e) => decMax.setRaw(e.target.value)}
            className="w-24"
            min={-90}
            max={90}
            step="any"
          />
        </div>

        <Button
          variant="destructive"
          size="default"
          onClick={() => handleDelete(selectedIds)}
          className={`gap-2 transition-opacity ${
            selectedIds.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          Delete ({selectedIds.length})
        </Button>
      </div>

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
        />
      )}
    </div>
  );
}
