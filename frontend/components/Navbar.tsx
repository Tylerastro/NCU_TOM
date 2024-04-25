"use client";
import { AuthTooltip } from "@/components/AuthNavBarTooltip";
import UnAuthTooltip from "@/components/UnauthNavBarTooltip";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hook";
import Link from "next/link";

const pages = [
  {
    name: "Targets",
    link: "/targetsv2",
    enabled: true,
  },
  {
    name: "Observations",
    link: "/observationsv2",
    enabled: true,
  },
  {
    name: "Data Products",
    link: "/data-products",
    enabled: false,
  },
  {
    name: "Annoucements",
    link: "/announcements",
    enabled: true,
  },
  {
    name: "About us",
    link: "/about",
    enabled: true,
  },
];

function NavBar() {
  const { isAuthenticated }: { isAuthenticated: boolean } = useAppSelector(
    (state) => state.auth
  );

  return (
    <div className="w-full h-16 max-w-12xl px-2 sm:px-6 lg:px-8 static flex items-center justify-around dark:bg-primary">
      <div>
        <h2 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl text-primary-foreground">
          <a href="/">NCU TOM</a>
        </h2>
      </div>
      <div>
        <nav className="flex">
          {pages.map((page) => (
            <Button
              disabled={!page.enabled}
              className="text-2xl lg:text-xl text-primary-foreground"
              variant={"link"}
              key={page.name}
            >
              <Link href={page.enabled ? page.link : "#"}>{page.name}</Link>
            </Button>
          ))}
        </nav>
      </div>
      <div>{isAuthenticated ? <AuthTooltip /> : <UnAuthTooltip />}</div>
    </div>
  );
}

export { NavBar };
