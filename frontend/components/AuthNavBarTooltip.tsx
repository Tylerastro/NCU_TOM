import {
  useLogoutMutation,
  useRetrieveUserQuery,
} from "@/redux/features/authApiSlice";
import { logout as setLogout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hook";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

const settings = [
  { name: "Dashboard", url: "/dashboard/lulin", disabled: false },
  { name: "Settings", url: "/settings", disabled: true },
];

import { Button as ButtonUI } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthTooltip() {
  const { data } = useRetrieveUserQuery();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      })
      .finally(() => {
        router.push("/");
      });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonUI variant="outline">Hi, {data?.username}</ButtonUI>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {settings.map((setting) => (
            <DropdownMenuItem key={setting.name} disabled={setting.disabled}>
              <Link href={setting.url} passHref>
                {setting.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogout()}>
          {" "}
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
