import TargetTable from "./TargetTable";

export default async function TargetsTable() {
  return (
    <main>
      <div className="flex space-between justify-between">
        <div>
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
            Targets
          </h1>
        </div>
      </div>
      <TargetTable />
    </main>
  );
}
