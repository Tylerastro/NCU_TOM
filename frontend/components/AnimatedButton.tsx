import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnimatedButtonProps {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function AnimatedButton({
  href,
  disabled = false,
  children,
}: AnimatedButtonProps) {
  return (
    <Button
      disabled={disabled}
      className="text-2xl lg:text-xl text-primary-foreground relative group no-underline"
      variant="link"
    >
      <Link
        href={disabled ? "#" : href}
        className="relative inline-block no-underline"
      >
        {children}
        <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-primary-foreground opacity-0 transform -translate-x-1/2 transition-all duration-800 ease-out group-hover:w-full group-hover:opacity-100" />
      </Link>
    </Button>
  );
}
