"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Check, MapPinned } from "lucide-react";

import { getTarget } from "@/apis/targets/getTarget";
import { putTarget } from "@/apis/targets/putTarget";
import { PutTarget, Target } from "@/models/targets";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTargetSimbad } from "@/apis/targets/getTargetSimbad";

function formatCoordinate(
  coordinate: string | undefined,
  decimalPlaces: number
): string {
  if (!coordinate) {
    return "";
  }
  const parts = coordinate.split(":");
  const lastPart = parseFloat(parts[2]).toFixed(decimalPlaces);
  const formattedLastPart = lastPart.padStart(decimalPlaces + 3, "0");
  return `${parts[0]}:${parts[1]}:${formattedLastPart}`;
}

function CoordCard(
  isEditing: boolean,
  handleSaveClick: () => void,
  handleEditClick: () => void,
  editedRA: string | undefined,
  setEditedRA: React.Dispatch<React.SetStateAction<string | undefined>>,
  target: Target | undefined,
  editedDec: string | undefined,
  setEditedDec: React.Dispatch<React.SetStateAction<string | undefined>>
) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Coords</CardTitle>
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
              {formatCoordinate(target?.coordinates?.split(" ")[0], 3)}
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
              {formatCoordinate(target?.coordinates?.split(" ")[1], 3)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PhotometryCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Photometry</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-rows-2 gap-2"></CardContent>
    </Card>
  );
}

export { CoordCard, PhotometryCard };
