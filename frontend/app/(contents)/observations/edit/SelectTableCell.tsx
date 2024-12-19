"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
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
  const selectRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newValue: string) => {
    if (enumObject[value] != newValue) {
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
      <div className="absolute">
        <Select
          defaultValue={value.toLocaleString()}
          onValueChange={(newValue) => {
            handleSelect(newValue);
          }}
          open={isEditing}
        >
          <SelectTrigger className="absolute top-0 left-0 opacity-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent ref={selectRef} className="relative left-0">
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
