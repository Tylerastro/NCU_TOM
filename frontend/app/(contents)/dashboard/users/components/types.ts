import { UserProfile } from "@/models/users";

export type SortField = "id" | "username" | "email" | "role" | "created_at" | "last_login";
export type SortDirection = "asc" | "desc";
export type StatusFilter = "all" | "active" | "inactive" | "deleted";
export type RoleFilter = "all" | "1" | "2" | "3" | "4";

export interface UserStats {
  total: number;
  active: number;
  faculty: number;
  admins: number;
  disabled: number;
}

export interface UserFiltersState {
  searchQuery: string;
  roleFilter: RoleFilter;
  statusFilter: StatusFilter;
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface UserTableProps {
  users: UserProfile[];
  isLoading: boolean;
  isFetching: boolean;
  onRoleChange: (userId: number, role: string) => void;
  isMutating: boolean;
}

export interface StatsCardsProps {
  stats: UserStats;
  isLoading: boolean;
}

export interface UserFiltersProps {
  filters: UserFiltersState;
  onSearchChange: (query: string) => void;
  onRoleFilterChange: (role: RoleFilter) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  totalCount: number;
  filteredCount: number;
}
