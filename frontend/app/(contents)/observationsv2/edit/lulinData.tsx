import { LulinObservations } from "@/models/observations";
import { PlusCircle } from "lucide-react";
import * as React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Button } from "@/components/ui/button";

type Option = {
  id: number;
  label: string;
};

const filterOptions: Option[] = [
  { id: 1, label: "u" },
  { id: 2, label: "g" },
  { id: 3, label: "r" },
  { id: 4, label: "i" },
  { id: 5, label: "z" },
];

const instrumentOptions: Option[] = [
  { id: 1, label: "LOT" },
  { id: 2, label: "SLT" },
  { id: 3, label: "TRIPOL" },
];

export default function LulinData(
  props: LulinObservations & {
    setCodeUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  }
) {
  const { setCodeUpdate, ...otherProps } = props;

  return (
    <Card x-chunk="dashboard-07-chunk-1">
      <CardHeader>
        <CardTitle>{props.target.name}</CardTitle>
        {/* <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">SKU</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[100px]">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">GGPC-001</TableCell>
              <TableCell>
                <Label htmlFor="stock-1" className="sr-only">
                  Stock
                </Label>
                <Input id="stock-1" type="number" defaultValue="100" />
              </TableCell>
              <TableCell>
                <Label htmlFor="price-1" className="sr-only">
                  Price
                </Label>
                <Input id="price-1" type="number" defaultValue="99.99" />
              </TableCell>
              <TableCell>
                <ToggleGroup type="single" defaultValue="s" variant="outline">
                  <ToggleGroupItem value="s">S</ToggleGroupItem>
                  <ToggleGroupItem value="m">M</ToggleGroupItem>
                  <ToggleGroupItem value="l">L</ToggleGroupItem>
                </ToggleGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <Button size="sm" variant="ghost" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          Add Variant
        </Button>
      </CardFooter>
    </Card>
  );
}
