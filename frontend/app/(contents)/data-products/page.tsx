import Events from "@/app/(contents)/data-products/Events";
import AstronomicalObservations from "@/components/data-products/DataOverview";

export default function DataProducts() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Data Products
          </h1>
          <p className="text-muted-foreground">
            Explore astronomical datasets and observational results
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Events />
        <AstronomicalObservations />
        {/* <EarthAnimation /> */}
      </div>
    </div>
  );
}
