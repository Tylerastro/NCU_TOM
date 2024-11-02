import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

export function LocalTimeTooltip({
  children,
  time,
}: {
  children: React.ReactNode;
  time: Date;
}) {
  const formattedTime = format(time, "PPpp");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Taipei: {formattedTime}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LocalTimeTooltip;
