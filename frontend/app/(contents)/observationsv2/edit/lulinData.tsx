import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

  return (
    <Carousel className="  max-w-[1200px] ">
      <CarouselContent>
        {props.data.map((observation, index) => (
          <CarouselItem className="basis-1/3" key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">
                    {observation.target.name}
                  </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
