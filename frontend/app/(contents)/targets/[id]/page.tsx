"use client";
import { getTarget } from "@/apis/targets/getTarget";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Overview } from "./overview";
import { RecentSales } from "./recent-sales";
import AladinViewer from "./aladin";
import React, { useInsertionEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Check, MapPinned } from "lucide-react";

function formatCoordinate(
  coordinate: string | undefined,
  decimalPlaces: number
): string {
  if (!coordinate) {
    return "0.00"; // Default value if coordinate is undefined
  }
  const parts = coordinate.split(":");
  const lastPart = parseFloat(parts[2]).toFixed(decimalPlaces);
  const formattedLastPart = lastPart.padStart(decimalPlaces + 3, "0");
  return `${parts[0]}:${parts[1]}:${formattedLastPart}`;
}

export default function DashboardPage(params: { params: { id: number } }) {
  const { data: target, refetch } = useQuery({
    queryKey: ["targets", params.params.id],
    queryFn: () => getTarget(params.params.id),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedRA, setEditedRA] = useState(target?.coordinates?.split(" ")[0]);
  const [editedDec, setEditedDec] = useState(
    target?.coordinates?.split(" ")[1]
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    // Here you would typically call an API to update the coordinates
    // For now, we'll just update the local state and refetch the data
    setIsEditing(false);
    await refetch();
  };

  return (
    <>
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Coords
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={isEditing ? handleSaveClick : handleEditClick}
                    >
                      {isEditing ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <MapPinned className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="grid grid-rows-2 gap-2">
                    <div className="flex items-center justify-around">
                      <span className="text-sm font-medium text-muted-foreground mr-2">
                        RA:
                      </span>
                      {isEditing ? (
                        <Input
                          value={editedRA}
                          onChange={(e) => setEditedRA(e.target.value)}
                          placeholder={target?.coordinates?.split(" ")[0]}
                          className="w-32 text-right"
                        />
                      ) : (
                        <span className="text-lg font-bold">
                          {formatCoordinate(
                            target?.coordinates?.split(" ")[0],
                            3
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-around">
                      <span className="text-sm font-medium text-muted-foreground mr-2">
                        Dec:
                      </span>
                      {isEditing ? (
                        <Input
                          value={editedDec}
                          onChange={(e) => setEditedDec(e.target.value)}
                          placeholder={target?.coordinates?.split(" ")[1]}
                          className="w-32 text-right"
                        />
                      ) : (
                        <span className="text-lg font-bold">
                          {formatCoordinate(
                            target?.coordinates?.split(" ")[1],
                            3
                          )}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Observations
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tags</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 6h.008v.008H6V6Z"
                      />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    {target?.tags && target?.tags?.length > 0 ? (
                      target?.tags?.map((tag) => (
                        <Badge key={tag.id} className="mr-1">
                          {" "}
                          {tag.name}{" "}
                        </Badge>
                      ))
                    ) : (
                      <div className="text-sm font-medium">No tags found</div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Citations
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
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
    </>
  );
}
