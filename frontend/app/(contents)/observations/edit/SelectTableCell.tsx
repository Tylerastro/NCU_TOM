"use client";

import React, { useState, ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditableTableCellProps<T extends { [key: string]: string | number }> {
  children: ReactNode;
  value: number;
  enumObject: T;
  onUpdate: (value: string) => void;
}

export default function SelectCell<
  T extends { [key: string]: string | number }
>({ children, value, enumObject, onUpdate }: EditableTableCellProps<T>) {
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleSelect = (newValue: string) => {
    if (newValue !== value.toLocaleString()) {
      onUpdate(newValue);
    }
    setIsEditing(false);
  };

  const options = Object.keys(enumObject)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: key,
    }));

  if (isEditing) {
    return (
      <div className="cursor-pointer flex items-center justify-center">
        <Select
          defaultValue={value.toLocaleString()}
          onValueChange={(newValue) => {
            console.log("Value selected:", newValue);
            handleSelect(newValue);
          }}
          open={isEditing}
        >
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 h-8 flex items-center justify-center"
    >
      {children}
    </div>
  );
}
