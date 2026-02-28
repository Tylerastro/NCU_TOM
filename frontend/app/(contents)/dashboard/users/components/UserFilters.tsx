import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleFilter, StatusFilter, UserFiltersProps } from "./types";

export default function UserFilters({
  filters,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        placeholder="Search..."
        value={filters.searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-8 w-full sm:w-48 text-sm bg-transparent"
      />

      <Select
        value={filters.roleFilter}
        onValueChange={(v) => onRoleFilterChange(v as RoleFilter)}
      >
        <SelectTrigger className="h-8 w-full sm:w-28 text-sm bg-transparent">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="1">Admin</SelectItem>
          <SelectItem value="2">Faculty</SelectItem>
          <SelectItem value="3">User</SelectItem>
          <SelectItem value="4">Disabled</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.statusFilter}
        onValueChange={(v) => onStatusFilterChange(v as StatusFilter)}
      >
        <SelectTrigger className="h-8 w-full sm:w-28 text-sm bg-transparent">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="deleted">Deleted</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
