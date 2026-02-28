"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const settings = [
  { name: "Dashboard", url: "/dashboard/", disabled: false },
  { name: "Settings", url: "/auth/settings", disabled: true },
];

export default function NavTooltip() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button asChild variant="ghost">
        <Link href="/auth/signin">Login</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-lg" variant="ghost">
          {session?.user?.username && session?.user?.is_active
            ? `Hi, ${session?.user?.username}`
            : "GUEST"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {settings.map((setting) => (
            <Link key={setting.name} href={setting.url} passHref>
              <DropdownMenuItem disabled={setting.disabled}>
                {setting.name}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
