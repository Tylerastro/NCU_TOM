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
    enabled: true,
  },
  {
    name: "Annoucements",
    link: "/announcements",
    enabled: false,
  },
  {
    name: "About us",
    link: "/about",
    enabled: true,
  },
];
import { AnimatedButton } from "./AnimatedButton";
import Logo from "./Logo";
import NavTooltip from "./NavTooltip";

export default function NavBar() {
  return (
    <div className="w-full h-16 px-2 py-2 sm:px-6 lg:px-8 fixed top-0 left-0 z-50  backdrop-blur-md border-b border-border/20">
      <div className="flex items-center justify-between">
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <nav className="flex space-x-4">
            {pages.map((page) => (
              <AnimatedButton
                key={page.name}
                href={page.link}
                disabled={!page.enabled}
              >
                {page.name}
              </AnimatedButton>
            ))}
          </nav>
        </div>

        <div className="shrink-0">
          <NavTooltip />
        </div>
      </div>
    </div>
  );
}
