"use client";

import React, { useState, ReactNode, useEffect, useRef } from "react";
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsEditing(true);
    setEditedValue(String(value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
        if (editedValue !== String(value)) {
          onUpdate(editedValue);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editedValue, value, onUpdate]);

  const handleInputBlur = () => {
    setIsEditing(false);
    if (editedValue !== String(value)) {
      onUpdate(editedValue);
    }
  };

  if (isEditing) {
    return (
      <div
        ref={wrapperRef}
        className="cursor-pointer items-center justify-center"
      >
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
