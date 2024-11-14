"use client";

import React, { useState, ReactNode } from "react";
import { Input } from "@/components/ui/input";

interface EditableTableCellProps {
  children: ReactNode;
  value: any;
  onUpdate: (value: string) => void;
}

export default function InputCell({
  children,
  value,
  onUpdate,
}: EditableTableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("");

  const handleClick = () => {
    setIsEditing(true);
    setEditedValue(String(value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (editedValue !== String(value)) {
      onUpdate(editedValue);
    }
  };

  if (isEditing) {
    return (
      <div className="cursor-pointer flex items-center justify-center">
        <Input
          value={editedValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="max-w-12 min-w-6 text-center h-8 p-1"
          autoFocus
        />
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
