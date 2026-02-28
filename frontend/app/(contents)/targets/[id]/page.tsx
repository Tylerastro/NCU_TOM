"use client";
import { use, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { getTarget } from "@/apis/targets";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Overview from "./overview";

// Dynamic import for Analytics - recharts is ~200KB
const Analytics = dynamic(() => import("./analytics"), {
  loading: () => <AnalyticsSkeleton />,
});

function PageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-48 mt-1" />
      </div>
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-3">
        <Skeleton className="h-64" />
      </div>
      <div className="col-span-12 lg:col-span-9">
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  );
}

export default function DashboardPage(props: { params: Promise<{ id: number }> }) {
  const params = use(props.params);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: target, isLoading } = useQuery({
    queryKey: ["targets", params.id],
    queryFn: () => getTarget(params.id),
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <Link
          href="/targets"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Targets
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {target?.name}
        </h1>
        <p className="text-muted-foreground">
          {target?.coordinates
            ? `RA: ${target.coordinates.split(" ")[0]}  Dec: ${target.coordinates.split(" ")[1]}`
            : "No coordinates available"}
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        {activeTab === "overview" && <Overview targetId={params.id} />}
        {activeTab === "analytics" && <Analytics targetId={params.id} />}
      </Tabs>
    </div>
  );
}
