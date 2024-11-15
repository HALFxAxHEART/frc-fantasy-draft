import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { DraftControls } from "./DraftControls";
import { EventSelector } from "@/components/EventSelector";
import { supabase } from "@/integrations/supabase/client";

interface DraftCreationSectionProps {
  userId: string;
  events: any[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export const DraftCreationSection = ({
  userId,
  events,
  selectedYear,
  onYearChange,
  selectedDistrict,
  onDistrictChange,
  isLoading,
  error
}: DraftCreationSectionProps) => {
  const [participants, setParticipants] = useState(2);
  const [participantNames, setParticipantNames] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartDraft = async () => {
    if (participantNames.some(name => !name.trim())) {
      toast({
        title: "Error",
        description: "All participants must have names",
        variant: "destructive",
      });
      return;
    }

    if (!selectedEvent) {
      toast({
        title: "Error",
        description: "Please select an event",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error: draftError } = await supabase
        .from('drafts')
        .insert({
          user_id: userId,
          event_key: selectedEvent,
          event_name: events?.find(e => e.key === selectedEvent)?.name || selectedEvent,
          status: 'active',
          participants: participantNames.map(name => ({ name, teams: [] })),
        })
        .select()
        .single();

      if (draftError) throw draftError;

      navigate(`/draft/${data.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create draft. Please try again.",
        variant: "destructive",
      });
      console.error('Draft creation error:', error);
    }
  };

  return (
    <div className="space-y-8">
      <DraftControls
        participants={participants}
        participantNames={participantNames}
        onParticipantsChange={(value) => {
          setParticipants(value);
          setParticipantNames(Array(value).fill(""));
        }}
        onParticipantNameChange={(index, value) => {
          const newNames = [...participantNames];
          newNames[index] = value;
          setParticipantNames(newNames);
        }}
        onStartDraft={handleStartDraft}
      />
      
      <EventSelector
        events={events}
        selectedEvent={selectedEvent}
        onEventChange={setSelectedEvent}
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        selectedDistrict={selectedDistrict}
        onDistrictChange={onDistrictChange}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};