import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EventSelector } from "./EventSelector";
import type { TBAEvent } from "@/lib/tba-api";

interface DraftCreationProps {
  events: TBAEvent[];
  isLoading: boolean;
  onCreateDraft: (eventKey: string, eventName: string) => void;
}

export const DraftCreation = ({
  events,
  isLoading,
  onCreateDraft,
}: DraftCreationProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  const handleCreateDraft = () => {
    const event = events.find(e => e.key === selectedEvent);
    if (event) {
      onCreateDraft(event.key, event.name);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Create New Draft</h2>
      
      <EventSelector
        events={events}
        selectedEvent={selectedEvent}
        onEventChange={setSelectedEvent}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        isLoading={isLoading}
      />

      <Button 
        onClick={handleCreateDraft}
        className="w-full"
        disabled={!selectedEvent}
      >
        Create Draft
      </Button>
    </Card>
  );
};