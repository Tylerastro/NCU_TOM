import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { auth } from "@/auth";
import { signOut } from "@/auth";

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

export default async function NavTooltip() {
  const session = await auth();
  return session ? AuthTooltip(session) : UnAuthTooltip();
}

function UnAuthTooltip() {
  return (
    <>
      <Button asChild variant="secondary">
        <Link href="/auth/signin">Login</Link>
      </Button>
    </>
  );
}

function AuthTooltip(session: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonUI variant="outline">Hi, {session?.user.username}</ButtonUI>
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
        <DropdownMenuItem>
          <form
            action={async (formData) => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit">logout</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
