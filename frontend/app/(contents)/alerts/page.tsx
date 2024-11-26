import React from "react";
import AlertTable from "./AlertTable";

export default function page() {
  return (
    <main>
      <div className="flex space-between justify-between">
        <div>
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
            Alerts
          </h1>
        </div>
      </div>
      <AlertTable />
    </main>
  );
}
