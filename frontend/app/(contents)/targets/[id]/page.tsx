"use client";

import { getTarget } from "@/apis/targets/getTarget";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import Analytics from "./analytics";
import Overview from "./overview";

export default function DashboardPage({ params }: { params: { id: number } }) {
  const { data: target, refetch } = useQuery({
    queryKey: ["targets", params.id],
    queryFn: () => getTarget(params.id),
  });

  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-3xl text-primary-foreground">
            {target?.name}
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <Overview target={target} refetch={refetch} targetId={params.id} />
          <Analytics targetId={params.id} />
        </Tabs>
      </div>
    </div>
  );
}
