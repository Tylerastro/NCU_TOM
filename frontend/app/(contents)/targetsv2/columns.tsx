"use client";

import { badgeVariants } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, User } from "@/models/helpers";
import { Target } from "@/models/targets";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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
          <Link href={`/users/${user.id}`}>{user.username}</Link>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const name: string = props.row.getValue("name");
      const id: number = props.row.getValue("id");
      return (
        <div className="text-primary-foreground font-medium">
          <Link href={`/targetsv2/${id}`}>{name}</Link>
        </div>
      );
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
    accessorKey: "tags",
    header: "tags",
    cell(props) {
      const tags: Tag[] = props.row.getValue("tags");
      return tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/targetsv2/tags/${tag.id}`}
          className={badgeVariants({ variant: "badge" })}
        >
          {tag.name}
        </Link>
      ));
    },
    filterFn: (row, id, value) => {
      const tags: Tag[] = row.original.tags;
      return value.some((filter: string) =>
        tags.some((tag) =>
          tag.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    },
  },
];
