import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const settings = [
  { name: "Dashboard", url: "/dashboard/", disabled: false },
  { name: "Settings", url: "/auth/settings", disabled: true },
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
        <ButtonUI className="dark:bg-primary" variant="outline">
          Hi, {session?.user.username}
        </ButtonUI>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {settings.map((setting) => (
            <Link key={setting.name} href={setting.url} passHref>
              <DropdownMenuItem key={setting.name} disabled={setting.disabled}>
                {setting.name}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form
          action={async (formData) => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="w-full" type="submit">
            <DropdownMenuItem>logout</DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
