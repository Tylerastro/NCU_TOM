import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Observatory } from "@/models/enums";
import { ETLLogs } from "@/models/helpers";

const TimeAgo = ({ date }: { date: Date }) => {
  const calculateTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInHours < 1) {
      return "Less than an hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    }
  };

  return (
    <span className="text-sm text-muted-foreground">
      {calculateTimeAgo(date)}
    </span>
  );
};

export default function EventCard({ event }: { event?: ETLLogs }) {
  if (!event) {
    return (
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription>No event</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full"></div>
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event {event.name}</CardTitle>
        <CardDescription>
          Regularly data extraction from {Observatory[event.observatory]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        Processed files: {event.file_processed} <br />
        Processed rows: {event.row_processed} <br />
        Status: {event.success ? "Success" : "Failed"}
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <TimeAgo date={new Date(event.created_at)} />
          {/* <Link href="#" className="text-primary" prefetch={false}>
            View Dataset
          </Link> */}
        </div>
      </CardFooter>
    </Card>
  );
}
