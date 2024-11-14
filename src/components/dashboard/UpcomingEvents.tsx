import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { TBAEvent } from "@/lib/tba-api";

export const UpcomingEvents = ({ 
  events, 
  isLoading, 
  onSelectEvent 
}: { 
  events: TBAEvent[], 
  isLoading: boolean,
  onSelectEvent: (key: string) => void
}) => {
  if (isLoading) {
    return <p>Loading events...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Browse upcoming FRC events</CardDescription>
      </CardHeader>
      <CardContent>
        {events?.length ? (
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.key}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" onClick={() => onSelectEvent(event.key)}>
                  Select
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No upcoming events</p>
        )}
      </CardContent>
    </Card>
  );
};