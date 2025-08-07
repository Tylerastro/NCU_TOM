"use client";

import { duplicateObservation } from "@/apis/observations/duplitcateObservation";
import LocalTimeTooltip from "@/components/LocalTimeTooltip";
import StatusBadge from "@/components/Status";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Observatory, Status } from "@/models/enums";
import { Tag, User } from "@/models/helpers";
import { Observation } from "@/models/observations";
import { ColumnDef } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { BookCopy } from "lucide-react";
import { toast } from "sonner";

import Link from "next/link";

export const getColumns = (refetch: () => void): ColumnDef<Observation>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell(props) {
      const id: number = props.row.getValue("id");
      return <div className="text-primary-foreground font-medium">{id}</div>;
    },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user: User = row.getValue("user");
      return (
        <div className="text-primary-foreground font-medium">
          <Link href={`/users/${user.id}`}>{user.username}</Link>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowUser: User = row.getValue(id);
      const rowValue: number = rowUser.id;
      return value.some((filter: string) => rowValue === parseInt(filter, 10));
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const name: string = props.row.getValue("name");
      const id: number = props.row.getValue("id");
      const status: number = props.row.getValue("status");
      const observatory: number = props.row.getValue("observatory");

      const routerMapping: { [key: number]: string } = {
        1: "edit",
        2: "pending",
      };
      return (
        <div className="text-primary-foreground font-medium">
          <Link
            href={{
              pathname:
                status === Status.Prep
                  ? `/observations/${routerMapping[1]}`
                  : status === Status.Pending
                  ? `/observations/${routerMapping[2]}`
                  : `/observations/${id}`,
              query: {
                id: id,
                observatory: observatory,
              },
            }}
          >
            {name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "observatory",
    header: "Observatory",
    cell(props) {
      const observatory: number = props.row.getValue("observatory");
      return (
        <div className="text-primary-foreground font-medium">
          {Observatory[observatory]}
        </div>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell(props) {
      const startDate: string = props.row.getValue("start_date");
      const date = parseISO(startDate);
      return (
        <LocalTimeTooltip time={date}>
          <div className="text-primary-foreground font-medium prevent-select">
            {formatInTimeZone(date, "UTC", "yyyy-MM-dd")}
          </div>
        </LocalTimeTooltip>
      );
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell(props) {
      const endDate: string = props.row.getValue("end_date");
      const date = parseISO(endDate);
      return (
        <LocalTimeTooltip time={date}>
          <div className="text-primary-foreground font-medium prevent-select">
            {formatInTimeZone(date, "UTC", "yyyy-MM-dd")}
          </div>
        </LocalTimeTooltip>
      );
    },
  },
  // {
  //   accessorKey: "tags",
  //   header: "Tags",
  //   cell(props) {
  //     const tags: Tag[] = props.row.getValue("tags");
  //     return tags.map((tag) => (
  //       <Link
  //         key={tag.id}
  //         href={`/targets/tags/${tag.id}`}
  //         className={badgeVariants({ variant: "badge" })}
  //       >
  //         {tag.name}
  //       </Link>
  //     ));
  //   },
  //   filterFn: (row, id, value) => {
  //     const tags: Tag[] = row.original.tags;
  //     return value.some((filter: number) =>
  //       tags.some((tag) => tag.id === filter)
  //     );
  //   },
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell(props) {
      const status: number = props.row.getValue("status");
      return <StatusBadge status={status} />;
    },
    filterFn: (row, id, value) => {
      const rowValue: number = row.getValue(id);
      return value.some((filter: string) => rowValue === parseInt(filter, 10));
    },
  },
  {
    accessorKey: "duplicate",
    header: "Duplicate",
    cell(props) {
      const id: number = props.row.getValue("id");
      
      const handleDuplicate = async () => {
        try {
          const response = await duplicateObservation(id);
          await refetch();
          toast.success(response.message || "Observation duplicated successfully");
        } catch (error) {
          console.error("Error duplicating observation:", error);
          toast.error("Failed to duplicate observation");
        }
      };

      return (
        <Button onClick={handleDuplicate} variant="ghost">
          <BookCopy className="h-4 w-4" />
        </Button>
      );
    },
  },
];
