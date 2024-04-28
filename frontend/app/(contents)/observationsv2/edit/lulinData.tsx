import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LulinObservations } from "@/models/observations";
import * as React from "react";
import { TargetLulinForm } from "./lulinForm";
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
    <Carousel className=" max-w-[800px] ">
      <CarouselContent>
        {props.data.map((observation, index) => (
          <CarouselItem className={basis} key={index}>
            <Sheet>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center h-full p-6">
                  <SheetTrigger>
                    <span className="text-4xl font-semibold">
                      {observation.target.name}
                    </span>
                  </SheetTrigger>
                </CardContent>
              </Card>

              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Edit {observation.target.name}</SheetTitle>
                  <SheetDescription>
                    Lorem ipsum dolor sit amet.
                  </SheetDescription>
                </SheetHeader>
                <TargetLulinForm observation={observation} />
              </SheetContent>
            </Sheet>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
