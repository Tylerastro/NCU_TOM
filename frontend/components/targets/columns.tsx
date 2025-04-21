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
        className="rounded-none"
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
        className="rounded-none"
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
          <Link href={`/targets/${id}`}>{name}</Link>
        </div>
      );
    },
  },
  {
    accessorKey: "ra",
    header: "RA",
    cell(props) {
      const ra: number = props.row.getValue("ra");
      const roundedRa = parseFloat(ra.toFixed(4));
      return (
        <div className="text-primary-foreground font-medium">{roundedRa}</div>
      );
    },
  },
  {
    accessorKey: "dec",
    header: "Dec",
    cell(props) {
      const dec: number = props.row.getValue("dec");
      const roundedDec = parseFloat(dec.toFixed(4));
      return (
        <div className="text-primary-foreground font-medium">{roundedDec}</div>
      );
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
          href={`/targets/tags/${tag.id}`}
          className={badgeVariants({ variant: "badge" })}
        >
          {tag.name}
        </Link>
      ));
    },
    filterFn: (row, id, value) => {
      const tags: Tag[] = row.original.tags;
      return value.some((filter: number) =>
        tags.some((tag) => tag.id === filter)
      );
    },
  },
];
