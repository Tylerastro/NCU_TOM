import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LulinObservations } from "@/models/observations";

import * as React from "react";
type Option = {
  id: number;
  label: string;
};

interface LulinDataProps {
  data: LulinObservations[];
  setCodeUpdate: React.Dispatch<boolean>;
}

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

export default function LulinData(props: LulinDataProps) {
  const { setCodeUpdate, ...otherProps } = props;

  let basis = "basis-1/3";
  if (props.data.length === 1) {
    basis = "basis-1/1";
  } else if (props.data.length === 2) {
    basis = "basis-1/2";
  }

  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Target</TableHead>
          <TableHead>Ra</TableHead>
          <TableHead>Dec</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
