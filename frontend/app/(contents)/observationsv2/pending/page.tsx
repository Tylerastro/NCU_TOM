"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Lulin from "./lulin";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  const observatory = searchParams.get("observatory");
  const observation_id = searchParams.get("id") || "";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";
  return (
    <Lulin
      start_date={start_date}
      end_date={end_date}
      observation_id={parseInt(observation_id)}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={LoadingSkeleton()}>
      <PageContent />
    </Suspense>
  );
}
