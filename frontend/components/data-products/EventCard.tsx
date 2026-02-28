import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ETLLogs } from "@/types/models";

interface EventCardProps {
  event?: ETLLogs;
}

const EventCard = ({ event }: EventCardProps) => {
  if (!event) {
    return (
      <Card className="overflow-hidden opacity-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-muted-foreground">
            No Event
          </CardTitle>
          <CardDescription>No recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Waiting for new events...
          </p>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = new Date(event.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base truncate" title={event.name}>
            {event.name}
          </CardTitle>
          <Badge
            variant={event.success ? "default" : "destructive"}
            className="ml-2 shrink-0"
          >
            {event.success ? "Success" : "Failed"}
          </Badge>
        </div>
        <CardDescription>Observatory {event.observatory}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Files Processed</span>
            <span className="font-medium">{event.file_processed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rows Processed</span>
            <span className="font-medium">{event.row_processed}</span>
          </div>
          <div className="pt-2 text-xs text-muted-foreground">
            {formattedDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
