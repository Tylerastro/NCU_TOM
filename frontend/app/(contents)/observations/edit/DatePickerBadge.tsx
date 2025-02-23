"use client";
import { putObservation } from "@/apis/observations/putObservation";
import { LocalTimeTooltip } from "@/components/LocalTimeTooltip";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

interface Observation {
  id: number;
  start_date: Date;
  end_date: Date;
}

export default function DatePickerBadges({
  observation,
  onDateChange,
}: {
  observation: Observation;
  onDateChange: () => void;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: toZonedTime(new Date(observation.start_date), "UTC"),
    to: toZonedTime(new Date(observation.end_date), "UTC"),
  });
  const [isOpen, setIsOpen] = useState(false);

  const setTimeForDate = (date: Date, hour: number): Date => {
    const dateString = format(date, "yyyy-MM-dd");
    return toZonedTime(
      new Date(`${dateString} ${hour.toString().padStart(2, "0")}:00:00`),
      "Asia/Taipei"
    );
  };

  const handleDateChange = async (range: DateRange | undefined) => {
    if (
      range?.from &&
      range?.from === range?.to &&
      date?.from &&
      date?.to &&
      range.from.getTime() === date.from.getTime()
    ) {
      setDate(undefined);
      return;
    }

    setDate(range);

    if (range?.from && range?.to && range?.from < range?.to) {
      try {
        const formattedStartDate = setTimeForDate(range.from, 18); // 6 PM
        const formattedEndDate = setTimeForDate(range.to, 6); // 8 AM

        await putObservation(observation.id, {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        })
          .then(() => {
            setIsOpen(false);
            onDateChange();
          })
          .catch((error) => {
            console.error(error);
            for (const key in error.response.data) {
              toast.error(`${key}: ${error.response.data[key][0]}`);
            }
          });
      } catch (error) {
        setDate({
          from: new Date(observation.start_date),
          to: new Date(observation.end_date),
        });
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="flex space-x-2">
            {date?.from && (
              <LocalTimeTooltip
                time={toZonedTime(observation.start_date, "Asia/Taipei")}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date?.from, "LLL dd, y")}
                </Badge>
              </LocalTimeTooltip>
            )}
            {date?.to && (
              <LocalTimeTooltip
                time={toZonedTime(observation.end_date, "Asia/Taipei")}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date?.to, "LLL dd, y")}
                </Badge>
              </LocalTimeTooltip>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
