"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { lazy, useEffect, useState, Suspense } from "react";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

import { getTarget, putTarget, getTargetSimbad } from "@/apis/targets";
import { PutTarget } from "@/models/targets";
import { CoordCard, ExternalLinksCard, SimbadCard } from "./cards";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Status } from "@/models/enums";
import {
  convertHourAngleToDegrees,
  convertSexagesimalDegreesToDecimal,
} from "@/utils/coordFormatter";

// Lazy load heavy components
const AladinViewer = lazy(() => import("./aladin"));

// Create individual card skeletons for better UX
function CoordCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium">Coordinates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-8 w-1/2 mt-4" />
        </div>
      </CardContent>
    </Card>
  );
}

function ObservationCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium">Observations</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardContent>
    </Card>
  );
}

function AladinViewerSkeleton() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Sky View</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  );
}

function SimbadCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simbad Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Overview({ targetId }: { targetId: number }) {
  // Fetch target data - React Query deduplicates requests with the same queryKey
  const { data: target, refetch } = useQuery({
    queryKey: ["targets", targetId],
    queryFn: () => getTarget(targetId),
  });

  const { data: simbadData, isLoading: simbadLoading } = useQuery({
    queryKey: ["targets", targetId, "simbad"],
    queryFn: () => getTargetSimbad(targetId),
    enabled: !!target,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedRA, setEditedRA] = useState(target?.coordinates?.split(" ")[0]);
  const [editedDec, setEditedDec] = useState(
    target?.coordinates?.split(" ")[1]
  );

  // Update state when target data loads
  useEffect(() => {
    if (target && target.coordinates) {
      const [ra, dec] = target.coordinates.split(" ");
      setEditedRA(ra);
      setEditedDec(dec);
    }
  }, [target]);

  const targetMutation = useMutation({
    mutationFn: (updatedTarget: PutTarget) =>
      putTarget(target?.id || 0, updatedTarget),
    onSuccess: () => {
      refetch();
      toast.success("Target updated successfully");
      setIsEditing(false);
    },
    onError: (error: any) => {
      handleApiError(error, "An error occurred while updating the target");
    },
  });

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = () => {
    if (!editedRA || !editedDec) {
      setIsEditing(false);
      return;
    }

    const raResult = convertHourAngleToDegrees(editedRA);
    const decResult = convertSexagesimalDegreesToDecimal(editedDec);

    if (raResult instanceof Error) {
      toast.error("Invalid Ra coordinates");
      return;
    }

    if (decResult instanceof Error) {
      toast.error("Invalid Dec coordinates");
      return;
    }

    if (target) {
      const updatedTarget: PutTarget = {
        ...target,
        ra: raResult,
        dec: decResult,
      };
      targetMutation.mutate(updatedTarget);
    }
  };

  const isLoading = !target;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <CoordCardSkeleton />
        ) : (
          <CoordCard
            isEditing={isEditing}
            handleSaveClick={handleSaveClick}
            handleEditClick={handleEditClick}
            editedRA={editedRA}
            setEditedRA={setEditedRA}
            target={target}
            editedDec={editedDec}
            setEditedDec={setEditedDec}
          />
        )}

        {isLoading ? (
          <ObservationCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {target?.observations?.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Finished:{" "}
                {
                  target?.observations?.filter(
                    (observation) => observation.status === Status.Done
                  ).length
                }
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <CoordCardSkeleton />
        ) : (
          <ExternalLinksCard targetName={target?.name || ""} />
        )}
      </div>

      {/* Aladin Viewer with Suspense */}
      <div className="grid gap-4 md:grid-cols-3">
        <Suspense fallback={<AladinViewerSkeleton />}>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Sky View</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <AladinViewer coord={target?.coordinates} fov={0.2} />
            </CardContent>
          </Card>
        </Suspense>

        {simbadLoading ? (
          <SimbadCardSkeleton />
        ) : (
          <SimbadCard data={simbadData} />
        )}
      </div>
    </div>
  );
}
