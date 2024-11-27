import { AnimatedButton } from "./AnimatedButton";
import Logo from "./Logo";
import NavTooltip from "./NavTooltip";

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
    <div className="w-full h-16 px-2 sm:px-6 lg:px-8 static flex items-center justify-around ">
      <div className="flex-shrink-0">
        <Logo />
      </div>

      <div className="flex ">
        <nav className="flex  px-4">
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

      <div className="flex-shrink-0">
        <NavTooltip />
      </div>
    </div>
  );
}

export { NavBar };
