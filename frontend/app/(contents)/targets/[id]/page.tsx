"use client";

import React, { lazy, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Check, MapPinned } from "lucide-react";

import { getTarget } from "@/apis/targets/getTarget";
import { putTarget } from "@/apis/targets/putTarget";
import { PutTarget, Target } from "@/models/targets";
import { CoordCard, PhotometryCard } from "./cards";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  convertHourAngleToDegrees,
  convertSexagesimalDegreesToDecimal,
} from "@/utils/coordFormatter";
import { getTargetSimbad } from "@/apis/targets/getTargetSimbad";

const AladinViewer = lazy(() => import("./aladin"));

export default function DashboardPage({ params }: { params: { id: number } }) {
  const { data: target, refetch } = useQuery({
    queryKey: ["targets", params.id],
    queryFn: () => getTarget(params.id),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedRA, setEditedRA] = useState(target?.coordinates?.split(" ")[0]);
  const [editedDec, setEditedDec] = useState(
    target?.coordinates?.split(" ")[1]
  );

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
            <TabsTrigger value="reports" disabled>
              Observations
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Others
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {CoordCard(
                isEditing,
                handleSaveClick,
                handleEditClick,
                editedRA,
                setEditedRA,
                target,
                editedDec,
                setEditedDec
              )}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Observations
                  </CardTitle>
                  {/* SVG icon */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {target?.observations?.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Finished: {target?.observations?.length}
                  </p>
                </CardContent>
              </Card>
              {/* Tags Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tags</CardTitle>
                  {/* SVG icon */}
                </CardHeader>
                <CardContent>
                  {target?.tags && target?.tags?.length > 0 ? (
                    target?.tags?.map((tag) => (
                      <Badge key={tag.id} className="mr-1">
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-sm font-medium">No tags found</div>
                  )}
                </CardContent>
              </Card>
              {PhotometryCard()}
            </div>
            {/* Aladin Viewer */}
            <div className="grid max-xl: gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <AladinViewer coord={target?.coordinates} fov={1.5} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
