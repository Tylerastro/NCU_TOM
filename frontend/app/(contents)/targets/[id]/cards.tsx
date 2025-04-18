"use client";

import { Check, MapPinned } from "lucide-react";

import { Target, TargetSimbad } from "@/models/targets";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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
        <CardTitle className="font-medium">Coords</CardTitle>
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

import { ExternalLink } from "lucide-react";

export default function ExternalLinksCard({
  targetName,
}: {
  targetName: string;
}) {
  const simbad_url = `https://simbad.u-strasbg.fr/simbad/sim-basic?Ident=${targetName}&submit=SIMBAD+search`;
  const ned_url = `https://ned.ipac.caltech.edu/byname?objname=${targetName}&hconst=67.8&omegam=0.308&omegav=0.692&wmap=4&corr_z=1`;
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">External Links</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ExternalLinkButton name="Simbad" href={simbad_url} />
        <ExternalLinkButton name="NED" href={ned_url} />
      </CardContent>
    </Card>
  );
}

function ExternalLinkButton({ name, href }: { name: string; href: string }) {
  return (
    <Button
      variant="outline"
      className="w-full justify-between hover:bg-primary hover:text-primary-foreground transition-colors"
      asChild
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        <span>{name}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  );
}

interface PhotometryCardProps {
  simbadData: TargetSimbad;
}

const PhotometryCard: React.FC<PhotometryCardProps> = ({ simbadData }) => {
  const photometryData = [
    { label: "U", value: simbadData.flux_U },
    { label: "B", value: simbadData.flux_B },
    { label: "V", value: simbadData.flux_V },
    { label: "R", value: simbadData.flux_R },
    { label: "I", value: simbadData.flux_I },
    { label: "J", value: simbadData.flux_J },
    { label: "H", value: simbadData.flux_H },
    { label: "K", value: simbadData.flux_K },
    { label: "u", value: simbadData.flux_u },
    { label: "g", value: simbadData.flux_g },
    { label: "r", value: simbadData.flux_r },
    { label: "i", value: simbadData.flux_i },
    { label: "z", value: simbadData.flux_z },
  ];

  return (
    <Card className="col-span-1 overflow-hidden">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="  text-primary-foreground">Photometry</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {photometryData.map(
              ({ label, value }) =>
                value !== null &&
                value !== undefined && (
                  <TableRow key={label}>
                    <TableCell className="font-medium text-sm py-2 prevent-select">
                      {label}
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <Badge
                        variant="secondary"
                        className="text-xs font-mono prevent-select"
                      >
                        {value.toFixed(2)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

function SimbadCard({ data }: { data?: TargetSimbad }) {
  return data ? (
    <PhotometryCard simbadData={data} />
  ) : (
    <Card className="col-span-1">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="text-primary-foreground">Photometry</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-4">
        <p className="text-muted-foreground">No data found</p>
      </CardContent>
    </Card>
  );
}

export { CoordCard, ExternalLinksCard, SimbadCard };
