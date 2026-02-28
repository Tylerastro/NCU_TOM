"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from "@/models/enums";
import { UserProfile } from "@/models/users";
import { useState } from "react";
import { SortDirection, SortField, UserTableProps } from "./types";

function SortIcon({
  field,
  currentField,
  direction,
}: {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
}) {
  const isActive = currentField === field;
  const isAsc = isActive && direction === "asc";
  const isDesc = isActive && direction === "desc";

  return (
    <span className="ml-1 inline-flex flex-col text-xs leading-none">
      <span
        className={
          isAsc
            ? "text-neutral-800 dark:text-neutral-100"
            : "text-neutral-300 dark:text-neutral-600"
        }
      >
        ↑
      </span>
      <span
        className={
          isDesc
            ? "text-neutral-800 dark:text-neutral-100"
            : "text-neutral-300 dark:text-neutral-600"
        }
      >
        ↓
      </span>
    </span>
  );
}

function getRoleLabel(role: number): string {
  switch (role) {
    case UserRole.Admin:
      return "Admin";
    case UserRole.Faculty:
      return "Faculty";
    case UserRole.User:
      return "User";
    default:
      return "Disabled";
  }
}

function formatDate(date: Date | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(date: Date | undefined): string {
  if (!date) return "—";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function StatusDot({ user }: { user: UserProfile }) {
  if (user.deleted_at) {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full bg-neutral-400"
        title="Deleted"
      />
    );
  }
  if (!user.is_active) {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full bg-amber-500"
        title="Inactive"
      />
    );
  }
  return (
    <span
      className="inline-block w-2 h-2 rounded-full bg-emerald-500"
      title="Active"
    />
  );
}

function LoadingState() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-24 text-center text-neutral-500">
        Loading...
      </TableCell>
    </TableRow>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-24 text-center text-neutral-500">
        No users found
      </TableCell>
    </TableRow>
  );
}

export default function UserTable({
  users,
  isLoading,
  isFetching,
  onRoleChange,
  isMutating,
}: UserTableProps) {
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a: UserProfile, b: UserProfile) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === "created_at" || sortField === "last_login") {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    }

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({
    field,
    children,
    className = "",
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead
      className={`cursor-pointer select-none text-xs font-medium text-neutral-500 dark:text-neutral-400 ${className}`}
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center">
        {children}
        <SortIcon
          field={field}
          currentField={sortField}
          direction={sortDirection}
        />
      </span>
    </TableHead>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
          <SortableHeader field="username">Name</SortableHeader>
          <SortableHeader field="email">Email</SortableHeader>
          <TableHead className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Institute
          </TableHead>
          <SortableHeader field="role">Role</SortableHeader>
          <TableHead className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-12"></TableHead>
          <SortableHeader field="last_login" className="text-right">
            Last Login
          </SortableHeader>
          <SortableHeader field="created_at" className="text-right">
            Created
          </SortableHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <LoadingState />
        ) : sortedUsers.length === 0 ? (
          <EmptyState />
        ) : (
          sortedUsers.map((user: UserProfile) => (
            <TableRow
              key={user.id}
              className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
            >
              <TableCell className="py-3">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.username}
                </span>
              </TableCell>
              <TableCell className="py-3 text-neutral-600 dark:text-neutral-400">
                {user.email}
              </TableCell>
              <TableCell className="py-3 text-neutral-600 dark:text-neutral-400">
                {user.institute || "—"}
              </TableCell>
              <TableCell className="py-3">
                <Select
                  value={
                    user.is_active
                      ? String(user.role)
                      : String(UserRole.Disabled)
                  }
                  onValueChange={(role) => onRoleChange(user.id, role)}
                  disabled={isFetching || isMutating}
                >
                  <SelectTrigger className="w-24 h-7 text-xs bg-transparent border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <SelectValue>
                      {getRoleLabel(
                        user.is_active ? user.role : UserRole.Disabled
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Admin</SelectItem>
                    <SelectItem value="2">Faculty</SelectItem>
                    <SelectItem value="3">User</SelectItem>
                    <SelectItem value="4">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-3 w-12">
                <StatusDot user={user} />
              </TableCell>
              <TableCell className="py-3 text-right text-sm text-neutral-500 tabular-nums">
                {formatRelativeTime(user.last_login)}
              </TableCell>
              <TableCell className="py-3 text-right text-sm text-neutral-500 tabular-nums">
                {formatDate(user.created_at)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
