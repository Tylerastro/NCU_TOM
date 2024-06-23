"use client";

import { Table } from "@tanstack/react-table";

import { DataTableViewOptions } from "./viewOptions";

import { getTags } from "@/apis/tags/getTags";
import { Tag } from "@/models/helpers";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import * as React from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

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

  return (
    <div className="flex items-center justify-between">
      <DataTableViewOptions table={table} />
    </div>
  );
}
