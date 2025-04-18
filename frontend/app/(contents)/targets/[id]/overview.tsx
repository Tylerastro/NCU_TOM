"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { lazy, useEffect, useState, Suspense } from "react";
import { toast } from "sonner";

import { putTarget } from "@/apis/targets/putTarget";
import { PutTarget, Target } from "@/models/targets";
import { CoordCard, ExternalLinksCard, SimbadCard } from "./cards";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { getTargetSimbad } from "@/apis/targets/getTargetSimbad";
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

function TagsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium">Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

function AladinViewerSkeleton() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
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

export default function Overview({
  targetId,
  target,
  refetch,
}: {
  targetId: number;
  target?: Target;
  refetch: () => void;
}) {
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
      if (error.response) {
        toast.error(
          error.response.data.detail ||
            "An error occurred while updating the target"
        );
      } else {
        toast.error(
          error.message || "An error occurred while updating the target"
        );
      }
      if (error.response && error.response.data) {
        for (const key in error.response.data) {
          toast.error(`${key}: ${error.response.data[key][0]}`);
        }
      }
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
    <TabsContent value="overview" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <CoordCardSkeleton />
        ) : (
          CoordCard(
            isEditing,
            handleSaveClick,
            handleEditClick,
            editedRA,
            setEditedRA,
            target,
            editedDec,
            setEditedDec
          )
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
          <TagsCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {target?.tags && target?.tags?.length > 0 ? (
                target?.tags?.map((tag) => (
                  <Badge key={tag.id} className="mr-1">
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <div className="font-medium">No tags found</div>
              )}
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
      <div className="grid max-xl: gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<AladinViewerSkeleton />}>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
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
    </TabsContent>
  );
}
