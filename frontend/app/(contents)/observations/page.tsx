import ObservationTable from "./ObservationTable";

export default async function ObservationsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Observations</h1>
          <p className="text-muted-foreground">
            Schedule and track your astronomical observations
          </p>
        </div>
      </div>

      <ObservationTable />
    </div>
  );
}
