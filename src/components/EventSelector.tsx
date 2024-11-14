import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TBAEvent } from "@/lib/tba-api";
import { Card } from "./ui/card";

interface EventSelectorProps {
  events: TBAEvent[] | undefined;
  selectedEvent: string;
  onEventChange: (value: string) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const EventSelector = ({
  events,
  selectedEvent,
  onEventChange,
  selectedYear,
  onYearChange,
  selectedDistrict,
  onDistrictChange,
  isLoading,
  error
}: EventSelectorProps) => {
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const districts = events 
    ? [...new Set(events.filter(e => e.district).map(e => e.district?.abbreviation))]
    : [];

  const filteredEvents = events?.filter(event => {
    if (selectedDistrict && event.district?.abbreviation !== selectedDistrict) {
      return false;
    }
    return true;
  });

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Event</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-background border rounded-md shadow-lg min-w-[200px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">District</label>
          <Select value={selectedDistrict} onValueChange={onDistrictChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent className="bg-background border rounded-md shadow-lg min-w-[200px]">
              <SelectItem key="all" value="all">All Districts</SelectItem>
              {districts.map((district) => (
                district && <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Event</label>
          <Select value={selectedEvent} onValueChange={onEventChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent className="bg-background border rounded-md shadow-lg min-w-[200px] max-h-[300px]">
              {filteredEvents?.map((event) => (
                <SelectItem key={event.key} value={event.key}>
                  {event.name} ({event.city}, {event.state_prov})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading events...</p>}
      {error && <p className="text-sm text-red-500">Error loading events: {error.message}</p>}
    </Card>
  );
};