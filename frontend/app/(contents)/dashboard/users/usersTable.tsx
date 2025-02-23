"use client";
import { editUser } from "@/apis/system/editUserRole";
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

import { getUserList } from "@/apis/system/getUserList";
import { UserRole } from "@/models/enums";
import { UserProfile } from "@/models/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const activeLight = (
  <div className="flex items-center justify-center">
    <span className="relative flex h-3 w-3 ">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
    </span>
  </div>
);

const inactiveLight = (
  <div className="flex items-center justify-center">
    <span className="relative flex h-3 w-3 ">
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
    </span>
  </div>
);

const deletedLight = (
  <div className="flex items-center justify-center">
    <span className="relative flex h-6 w-6 ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </span>
  </div>
);

export default function UserTable() {
  const {
    data: users,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUserList(),
    initialData: () => [],
  });

  const mutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: number }) => {
      if (role == UserRole.Disabled) {
        return editUser(userId, undefined, false);
      }
      return editUser(userId, role, true);
    },
    onSuccess: () => {
      refetch();
      toast.success("Role edited successfully");
    },
    onError: (error: any) => {
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
      for (const key in error.data) {
        toast.error(`${key}: ${error.data[key][0]}`);
      }
    },
  });

  const handleRoleChange = (userId: number, role: string) => {
    mutation.mutate({ userId, role: Number(role) });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] text-center">id</TableHead>
          <TableHead className="w-[100px] text-center">Username</TableHead>
          <TableHead className="w-[150px] text-center">Role</TableHead>
          <TableHead className="w-[100px] text-center">Institute</TableHead>
          <TableHead className="w-[150px] text-center">Email</TableHead>
          <TableHead className="w-[50px] text-center">Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: UserProfile) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium text-center w-[50px]">
              {user.id}
            </TableCell>
            <TableCell className="font-medium text-center w-[100px]">
              {user.username}
            </TableCell>
            <TableCell className="text-center w-[150px]">
              {
                <Select
                  onValueChange={(role) => handleRoleChange(user.id, role)}
                >
                  <SelectTrigger
                    disabled={isFetching}
                    className="flex text-center justify-center "
                  >
                    <SelectValue
                      placeholder={
                        user.is_active
                          ? UserRole[user.role]
                          : UserRole[UserRole.Disabled]
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="flex text-center justify-center">
                    {Object.values(UserRole)
                      .filter((value) => typeof value === "number")
                      .map((role) => (
                        <SelectItem key={role} value={String(role)}>
                          {UserRole[role as number]}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              }
            </TableCell>
            <TableCell className="text-center w-[100px]">
              {user.institute}
            </TableCell>
            <TableCell className="text-center w-[150px]">
              {user.email}
            </TableCell>
            <TableCell className="text-center w-[50px]">
              {user.deleted_at
                ? deletedLight
                : user.is_active
                ? activeLight
                : inactiveLight}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
