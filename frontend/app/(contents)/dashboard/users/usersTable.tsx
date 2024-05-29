"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editUserRole } from "@/apis/system/editUserRole";

import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { UserRole } from "@/models/enums";
import { getUserList } from "@/apis/system/getUserList";
import { UserProfile } from "@/models/users";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingSkeleton() {
  return (
    <div className="flex text-center justify-center">
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

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

export default function UserTable() {
  const {
    data: users,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUserList(),
    select: (data) =>
      data.sort((a: UserProfile, b: UserProfile) => a.id - b.id),
    initialData: () => [],
  });

  const mutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: number }) => {
      return editUserRole(userId, role);
    },
    onSuccess: () => {
      refetch();
      toast.success("Role edited successfully");
    },
  });

  const handleRoleChange = (userId: number, role: string) => {
    mutation.mutate({ userId, role: Number(role) });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">id</TableHead>
          <TableHead className="w-[100px]">Username</TableHead>
          <TableHead className="text-center">Role</TableHead>
          <TableHead className="text-center">Institute</TableHead>
          <TableHead className="text-center">Email</TableHead>
          <TableHead className="text-center">Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: UserProfile) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell className="text-center">
              {
                <Select
                  onValueChange={(role) => handleRoleChange(user.id, role)}
                >
                  <SelectTrigger
                    disabled={isFetching}
                    className="flex text-center justify-center "
                  >
                    <SelectValue placeholder={UserRole[user.role]} />
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
            <TableCell className="text-center">{user.institute}</TableCell>
            <TableCell className="text-center">{user.email}</TableCell>
            <TableCell className="text-center">
              {user.is_active ? activeLight : inactiveLight}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
