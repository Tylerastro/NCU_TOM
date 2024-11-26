import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TrashIcon, PlayIcon } from "@radix-ui/react-icons";
import { Alert } from "@/models/alerts";
import { formatUTC } from "@/utils/timeFormatter";

export const columns: ColumnDef<Alert>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "broker",
    header: "Broker",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("broker")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
  },
  {
    accessorKey: "last_run",
    header: "Last Run",
    cell: ({ row }) => <div>{row.getValue("last_run")}</div>,
  },
  {
    id: "run",
    header: "Run",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => console.log("Run alert", row.original)}
        className="hover:text-primary"
      >
        <PlayIcon className="h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => console.log("Delete alert", row.original)}
        className="hover:text-destructive"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    ),
  },
];
