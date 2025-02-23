"use client";
import { putObservation } from "@/apis/observations/putObservation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@/models/enums";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

import Lulin from "./lulin";

function LoadingSkeleton() {
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

  return <Lulin observation_id={parseInt(observation_id)} />;
}

function VerifyButton() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const observation_id = searchParams.get("id") || "";
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => {
      return putObservation(parseInt(observation_id), { status: 3 });
    },
    onSuccess: () => {
      toast.success("Observation has been verified");
      router.push("/observations");
    },
  });

  const handleVerify = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <Button
      onClick={handleVerify}
      disabled={session?.user?.role === UserRole.User}
      variant="outline"
      className="transition-colors hover:duration-600 dark:hover:bg-green-600"
    >
      Verify
    </Button>
  );
}

export default function Page() {
  return (
    <>
      <div className="flex space-between justify-between pb-10">
        <div>
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
            Verify the submission
          </h1>
        </div>
        <div className="flex gap-2">
          <Suspense fallback={<div>Loading...</div>}>
            <VerifyButton />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <PageContent />
      </Suspense>
    </>
  );
}
