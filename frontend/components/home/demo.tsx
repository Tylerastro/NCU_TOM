import { cn } from "@/components/utils";
import EarthAnimation from "../three/Earth";

interface IntroProps {
  className?: string;
}

export default async function Demo({ className }: IntroProps) {
  return (
    <section
      className={cn("relative min-h-screen w-full py-24 px-12", className)}
    >
      <div className="container relative mx-auto grid gap-4 px-32 md:grid-cols-5 md:gap-2">
        {/* Left column - 2/5 width */}
        <div className="col-span-2 flex flex-col justify-center space-y-8">
          <EarthAnimation />
        </div>

        {/* Right column - 3/5 width */}
        <div className="col-span-3 flex flex-col justify-center">
          <video controls src="" className="w-full rounded-lg" />
        </div>
      </div>
    </section>
  );
}
