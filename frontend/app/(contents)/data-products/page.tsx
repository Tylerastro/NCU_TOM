import AstronomicalObservations from "@/components/data-products/DataPlots";
import EarthAnimation from "@/components/three/Earth";
import Events from "@/components/data-products/Events";

export default function Component() {
  return (
    <main>
      <div className="flex flex-col min-h-screen ">
        <header className=" border-b px-4 py-3 sm:px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
              Datasets
            </h1>
          </div>
        </header>
        <Events />
        <AstronomicalObservations />
        <EarthAnimation />
      </div>
    </main>
  );
}
