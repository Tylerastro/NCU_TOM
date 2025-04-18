import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnimatedButtonProps {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string; // Make className optional
}

export function AnimatedButton({
  href,
  disabled = false,
  children,
  className = "", // Provide default empty string
}: AnimatedButtonProps) {
  return (
    <Button
      disabled={disabled}
      className={`
        relative group no-underline
        ${className}
        md:text-xl md:px-3
        text-lg w-full md:w-auto
        transition-colors duration-200
      `}
      variant="link"
    >
      <Link
        href={disabled ? "#" : href}
        className="relative inline-block no-underline w-full"
      >
        {children}
        <span
          className="
          absolute left-1/2 bottom-0 
          w-0 h-0.5 
          bg-primary-foreground 
          opacity-0 
          transform -translate-x-1/2 
          transition-all duration-800 ease-out 
          group-hover:w-full group-hover:opacity-100
          md:block hidden // Only show underline animation on desktop
        "
        />
      </Link>
    </Button>
  );
}
