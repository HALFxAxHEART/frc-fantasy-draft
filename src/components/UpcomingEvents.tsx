import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TBAEvent } from "@/lib/tba-api";

interface UpcomingEventsProps {
  events: TBAEvent[] | undefined;
  onEventSelect: (eventKey: string) => void;
  isLoading?: boolean;
}

export const UpcomingEvents = ({ events, onEventSelect, isLoading }: UpcomingEventsProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <div className="text-center text-muted-foreground py-8">
          Loading events...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
      <div className="space-y-4">
        {events?.slice(0, 5).map((event) => (
          <div key={event.key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold">{event.name}</h3>
              <p className="text-sm text-muted-foreground">
                {event.city}, {event.state_prov}
              </p>
            </div>
            <Button variant="outline" onClick={() => onEventSelect(event.key)}>
              Select
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};