import NavTooltip from "./NavTooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "./Logo";

const pages = [
  {
    name: "Targets",
    link: "/targets",
    enabled: true,
  },
  {
    name: "Observations",
    link: "/observations",
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
  return (
    <div className="w-full h-16 max-w-12xl px-2 sm:px-6 lg:px-8 static flex items-center justify-around dark:bg-primary">
      <Logo />
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
      <div>
        <NavTooltip />
      </div>
    </div>
  );
}

export { NavBar };
