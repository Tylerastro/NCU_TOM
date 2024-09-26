"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LulinPage from "./lulin";

function PageContent() {
  const searchParams = useSearchParams();
  const observatory = searchParams.get("observatory");
  const observation_id = searchParams.get("id") || "";
  return <LulinPage observation_id={parseInt(observation_id)} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
