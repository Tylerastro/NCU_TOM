"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./viewOptions";

import { getTags } from "@/apis/tags/getTags";
import { Tag, User } from "@/models/helpers";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { DataTableFacetedFilter } from "./dataTableFacetedFilter";
import { getUserList } from "@/apis/system/getUserList";
import { useQuery } from "@tanstack/react-query";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface TransformedUser {
  label: string;
  value: number;
}

const statuses = [
  {
    label: "Prep.",
    value: 1,
  },
  {
    label: "Pending",
    value: 2,
  },
  {
    label: "In progress",
    value: 3,
  },
  {
    label: "Done",
    value: 4,
  },
  {
    label: "Expired",
    value: 5,
  },
  {
    label: "Denied",
    value: 6,
  },
  {
    label: "Postponed",
    value: 7,
  },
];

function transformTagToOption(tag: Tag) {
  return {
    value: tag.id || 0,
    label: tag.name,
    icon: QuestionMarkCircledIcon,
  };
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [tagOptions, setTagOptions] = React.useState<
    { value: number; label: string; icon: React.ComponentType<any> }[]
  >([]);

  React.useEffect(() => {
    getTags().then((tags) => {
      setTags(tags);
    });
  }, []);

  React.useEffect(() => {
    setTagOptions(tags.map(transformTagToOption));
  }, [tags]);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUserList(),
    initialData: [] as User[],
  });

  const transformUsersData = (users: User[]): TransformedUser[] => {
    return users.map((user) => ({
      label: user.username,
      value: user.id,
    }));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter observations..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="text-primary-foreground h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("tags") && (
          <DataTableFacetedFilter
            column={table.getColumn("tags")}
            title="Tags"
            options={tagOptions}
            autoCounter={false}
          />
        )}
        {table.getColumn("user") && (
          <DataTableFacetedFilter
            column={table.getColumn("user")}
            title="User"
            options={transformUsersData(users)}
            autoCounter={true}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
            autoCounter={true}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 text-black bg-white hover:bg-white/90"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
