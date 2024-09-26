import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LulinRuns } from "@/models/observations";
import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TargetLulinForm } from "./lulinForm";

type Option = {
  id: number;
  label: string;
};

interface LulinDataProps {
  data: LulinRuns[];
  setCodeUpdate: React.Dispatch<boolean>;
}

const filterOrder = ["u", "g", "r", "i", "z"];

export default function LulinData(props: LulinDataProps) {
  const { setCodeUpdate, ...otherProps } = props;

  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Edit</TableHead>
          <TableHead className="w-[100px]">Target</TableHead>
          <TableHead>Ra</TableHead>
          <TableHead>Dec</TableHead>
          <TableHead className="text-right">Binning</TableHead>
          <TableHead className="text-right">Frames</TableHead>
          <TableHead className="text-right">Instrument</TableHead>
          <TableHead className="text-right">Filters</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.data.map((data) => (
          <TableRow key={data.id}>
            <TableCell>
              <Sheet modal={false}>
                <SheetTrigger>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.9 0.499976C13.9 0.279062 13.7209 0.0999756 13.5 0.0999756C13.2791 0.0999756 13.1 0.279062 13.1 0.499976V1.09998H12.5C12.2791 1.09998 12.1 1.27906 12.1 1.49998C12.1 1.72089 12.2791 1.89998 12.5 1.89998H13.1V2.49998C13.1 2.72089 13.2791 2.89998 13.5 2.89998C13.7209 2.89998 13.9 2.72089 13.9 2.49998V1.89998H14.5C14.7209 1.89998 14.9 1.72089 14.9 1.49998C14.9 1.27906 14.7209 1.09998 14.5 1.09998H13.9V0.499976ZM11.8536 3.14642C12.0488 3.34168 12.0488 3.65826 11.8536 3.85353L10.8536 4.85353C10.6583 5.04879 10.3417 5.04879 10.1465 4.85353C9.9512 4.65827 9.9512 4.34169 10.1465 4.14642L11.1464 3.14643C11.3417 2.95116 11.6583 2.95116 11.8536 3.14642ZM9.85357 5.14642C10.0488 5.34168 10.0488 5.65827 9.85357 5.85353L2.85355 12.8535C2.65829 13.0488 2.34171 13.0488 2.14645 12.8535C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L9.14646 5.14642C9.34172 4.95116 9.65831 4.95116 9.85357 5.14642ZM13.5 5.09998C13.7209 5.09998 13.9 5.27906 13.9 5.49998V6.09998H14.5C14.7209 6.09998 14.9 6.27906 14.9 6.49998C14.9 6.72089 14.7209 6.89998 14.5 6.89998H13.9V7.49998C13.9 7.72089 13.7209 7.89998 13.5 7.89998C13.2791 7.89998 13.1 7.72089 13.1 7.49998V6.89998H12.5C12.2791 6.89998 12.1 6.72089 12.1 6.49998C12.1 6.27906 12.2791 6.09998 12.5 6.09998H13.1V5.49998C13.1 5.27906 13.2791 5.09998 13.5 5.09998ZM8.90002 0.499976C8.90002 0.279062 8.72093 0.0999756 8.50002 0.0999756C8.2791 0.0999756 8.10002 0.279062 8.10002 0.499976V1.09998H7.50002C7.2791 1.09998 7.10002 1.27906 7.10002 1.49998C7.10002 1.72089 7.2791 1.89998 7.50002 1.89998H8.10002V2.49998C8.10002 2.72089 8.2791 2.89998 8.50002 2.89998C8.72093 2.89998 8.90002 2.72089 8.90002 2.49998V1.89998H9.50002C9.72093 1.89998 9.90002 1.72089 9.90002 1.49998C9.90002 1.27906 9.72093 1.09998 9.50002 1.09998H8.90002V0.499976Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Edit {data.target.name}</SheetTitle>
                    <SheetDescription>
                      Lorem ipsum dolor sit amet.
                    </SheetDescription>
                  </SheetHeader>
                  <TargetLulinForm observation={data} />
                </SheetContent>
              </Sheet>
            </TableCell>
            <TableCell className="font-medium">{data.target.name}</TableCell>
            <TableCell>{data.target.ra}</TableCell>
            <TableCell>{data.target.dec}</TableCell>
            <TableCell className="text-right">{data.binning}</TableCell>
            <TableCell className="text-right">{data.frames}</TableCell>
            <TableCell className="text-right">
              {Object.entries(data.instruments)
                .filter(([_, value]) => value)
                .map(([key]) => key)
                .join(", ")}
            </TableCell>
            <TableCell className="text-right">
              {Object.entries(data.filters)
                .filter(([_, value]) => value)
                .sort(
                  ([a], [b]) => filterOrder.indexOf(a) - filterOrder.indexOf(b)
                )
                .map(([key]) => key)
                .join(", ")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
