import { cn } from "@/components/utils";
import EarthAnimation from "../three/Earth";

interface IntroProps {
  className?: string;
}

export default async function Demo({ className }: IntroProps) {
  return (
    <section className={cn("relative  w-full px-12", className)}>
      <div className="container relative mx-auto grid gap-4 px-32 md:grid-cols-4 md:gap-2">
        <div className="col-span-5 flex flex-col justify-center space-y-8">
          <EarthAnimation />
        </div>

        {/* <div className="col-span-2 flex flex-col justify-center">
          <video controls src="" className="w-full rounded-lg" />
        </div> */}
      </div>
    </section>
  );
}
