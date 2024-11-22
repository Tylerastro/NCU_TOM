import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/utils";

interface IntroProps {
  className?: string;
}

export default async function Intro({ className }: IntroProps) {
  return (
    <section
      className={cn("relative min-h-screen w-full py-24 px-12", className)}
    >
      <div className="container relative mx-auto grid gap-4 px-32 md:grid-cols-5 md:gap-2">
        {/* Left column - 2/5 width */}
        <div className="col-span-2 flex flex-col justify-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold tracking-tighter text-white sm:text-7xl">
              NCU TOM
            </h1>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Target <br />
              Observation <br />
              Manager
            </h2>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-[#7C3AED] text-white hover:bg-[#7C3AED]/90"
            >
              Get Started
            </Button>
            <Link target="_blank" href="https://github.com/Tylerastro/NCU_TOM">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 bg-transparent text-white hover:bg-gray-800"
              >
                <Github className="mr-2 h-5 w-5" />
                Source
              </Button>
            </Link>
          </div>
        </div>

        {/* Right column - 3/5 width */}
        <div className="col-span-3 flex flex-col justify-center">
          <div className="rounded-lg border border-gray-800 bg-black p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>
            <pre className="mt-4 font-mono text-sm text-gray-300">
              <code>{`// auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
export const { auth, handlers } = NextAuth({ providers: [GitHub] })

// middleware.ts
export { auth as middleware } from "@/auth"

// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
