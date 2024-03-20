"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Target } from "@/models/targets";
import { User } from "@/models/helpers";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Target>[] = [
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
          {user.username}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const name: number = props.row.getValue("name");
      return <div className="text-primary-foreground font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "ra",
    header: "RA",
    cell(props) {
      const ra: number = props.row.getValue("ra");
      return <div className="text-primary-foreground font-medium">{ra}</div>;
    },
  },
  {
    accessorKey: "dec",
    header: "Dec",
    cell(props) {
      const dec: number = props.row.getValue("dec");
      return <div className="text-primary-foreground font-medium">{dec}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell(props) {
      const created_at: number = props.row.getValue("created_at");
      return (
        <div className="text-primary-foreground font-medium">{created_at}</div>
      );
    },
  },
];
