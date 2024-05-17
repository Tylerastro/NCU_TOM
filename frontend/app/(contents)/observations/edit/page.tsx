"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Lulin from "./lulin";

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
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
