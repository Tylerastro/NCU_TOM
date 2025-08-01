import TargetTable from "./TargetTable";

export default async function TargetsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Astronomical Targets
          </h1>
          <p className="text-muted-foreground">
            Manage your observing targets and plan your sessions
          </p>
        </div>
      </div>

      <TargetTable />
    </div>
  );
}
