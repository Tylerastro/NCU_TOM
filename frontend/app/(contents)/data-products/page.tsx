import Events from "@/app/(contents)/data-products/Events";
import AstronomicalObservations from "@/components/data-products/DataOverview";

export default function DataProducts() {
  return (
    <main>
      <div className="flex space-between justify-between">
        <header className=" px-4 py-3 sm:px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
              Datasets
            </h1>
          </div>
        </header>
      </div>
      <Events />
      <AstronomicalObservations />
      {/* <EarthAnimation /> */}
    </main>
  );
}
