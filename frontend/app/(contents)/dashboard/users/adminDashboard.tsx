"use client";

import { editUser, getUserList } from "@/apis/system";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/models/enums";
import { UserProfile } from "@/models/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import StatsCards from "./components/StatsCards";
import { RoleFilter, StatusFilter, UserFiltersState, UserStats } from "./components/types";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";

function RefreshIcon({ isSpinning }: { isSpinning: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function useUserStats(users: UserProfile[]): UserStats {
  return useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.is_active && !u.deleted_at).length,
    faculty: users.filter((u) => u.role === UserRole.Faculty && u.is_active).length,
    admins: users.filter((u) => u.role === UserRole.Admin && u.is_active).length,
    disabled: users.filter((u) => !u.is_active || u.deleted_at).length,
  }), [users]);
}

function useFilteredUsers(users: UserProfile[], filters: UserFiltersState): UserProfile[] {
  return useMemo(() => {
    let result = [...users];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.institute?.toLowerCase().includes(query) ||
          user.first_name?.toLowerCase().includes(query) ||
          user.last_name?.toLowerCase().includes(query)
      );
    }

    if (filters.roleFilter !== "all") {
      result = result.filter((user) => user.role === Number(filters.roleFilter));
    }

    if (filters.statusFilter !== "all") {
      result = result.filter((user) => {
        if (filters.statusFilter === "active") return user.is_active && !user.deleted_at;
        if (filters.statusFilter === "inactive") return !user.is_active && !user.deleted_at;
        if (filters.statusFilter === "deleted") return !!user.deleted_at;
        return true;
      });
    }

    return result;
  }, [users, filters]);
}

export default function AdminDashboard() {
  const [filters, setFilters] = useState<UserFiltersState>({
    searchQuery: "",
    roleFilter: "all",
    statusFilter: "all",
  });

  const {
    data: users = [],
    refetch,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUserList(),
  });

  const mutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: number }) => {
      if (role === UserRole.Disabled) {
        return editUser(userId, undefined, false);
      }
      return editUser(userId, role, true);
    },
    onSuccess: () => {
      refetch();
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
    },
  });

  const stats = useUserStats(users);
  const filteredUsers = useFilteredUsers(users, filters);

  const handleRoleChange = (userId: number, role: string) => {
    mutation.mutate({ userId, role: Number(role) });
  };

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleRoleFilterChange = (role: RoleFilter) => {
    setFilters((prev) => ({ ...prev, roleFilter: role }));
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setFilters((prev) => ({ ...prev, statusFilter: status }));
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            User Management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshIcon isSpinning={isFetching} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* User Table Card */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader className="py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-base font-medium">Users</CardTitle>
              <CardDescription className="text-xs">
                {filteredUsers.length === users.length
                  ? `${users.length} total`
                  : `${filteredUsers.length} of ${users.length}`
                }
              </CardDescription>
            </div>
            <UserFilters
              filters={filters}
              onSearchChange={handleSearchChange}
              onRoleFilterChange={handleRoleFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
              totalCount={users.length}
              filteredCount={filteredUsers.length}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <UserTable
            users={filteredUsers}
            isLoading={isLoading}
            isFetching={isFetching}
            onRoleChange={handleRoleChange}
            isMutating={mutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
