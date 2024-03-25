"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./viewOptions";

import { fetchTags } from "@/apis/tags";
import { Tag } from "@/models/helpers";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { DataTableFacetedFilter } from "./dataTableFacetedFilter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

function transformTagToOption(tag: Tag) {
  return {
    value: tag,
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
    { value: Tag; label: string; icon: React.ComponentType<any> }[]
  >([]);

  React.useEffect(() => {
    fetchTags().then((tags) => {
      setTags(tags);
    });
  }, []);

  React.useEffect(() => {
    setTagOptions(tags.map(transformTagToOption));
  }, [tags]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter targets..."
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
