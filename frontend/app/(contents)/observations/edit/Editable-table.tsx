"use client";

import React, { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { LulinInstrument, LulinFilter } from "@/models/enums";
import { LulinRuns } from "@/models/observations";

interface EditingField {
  path: string[];
  value: any;
}

export default function EditableTableRow({
  data,
  onUpdate,
}: {
  data: LulinRuns;
  onUpdate: (updatedData: LulinRuns) => void;
}) {
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [editedValue, setEditedValue] = useState("");

  const handleCellClick = (path: string[], value: any) => {
    setEditingField({ path, value });
    setEditedValue(String(value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (!editingField) return;

    const updatedData = { ...data };
    let current: any = updatedData;

    // Navigate to the nested property
    for (let i = 0; i < editingField.path.length - 1; i++) {
      current = current[editingField.path[i]];
    }

    // Update the value
    const lastKey = editingField.path[editingField.path.length - 1];
    current[lastKey] = editedValue;

    onUpdate(updatedData);
    setEditingField(null);
  };

  const renderCell = (path: string[], value: any, align = "left") => {
    const isEditing = editingField?.path.join(".") === path.join(".");

    if (isEditing) {
      return (
        <TableCell className={`text-${align} justify-center`}>
          <Input
            value={editedValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="max-w-[50px]"
            autoFocus
          />
        </TableCell>
      );
    }

    return (
      <TableCell
        className={`text-${align} cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800`}
        onClick={() => handleCellClick(path, value)}
      >
        {value}
      </TableCell>
    );
  };

  return (
    <>
      {renderCell(["target", "name"], data.target.name, "left")}
      {renderCell(["target", "ra"], data.target.ra, "center")}
      {renderCell(["target", "dec"], data.target.dec, "center")}
      {renderCell(["exposure_time"], data.exposure_time, "right")}
      {renderCell(["binning"], data.binning, "right")}
      {renderCell(["frames"], data.frames, "right")}
      {renderCell(
        ["instrument"],
        data.instrument ? LulinInstrument[data.instrument] : "Unknown",
        "right"
      )}
      {renderCell(
        ["filter"],
        data.filter ? LulinFilter[data.filter] : "Unknown",
        "right"
      )}
    </>
  );
}
