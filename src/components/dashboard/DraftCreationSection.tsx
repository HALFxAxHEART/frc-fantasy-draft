import { useState, useEffect } from "react";
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
  selectedEvent: string;
  onEventChange: (event: string) => void;
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
  selectedEvent,
  onEventChange,
  isLoading,
  error
}: DraftCreationSectionProps) => {
  const [participants, setParticipants] = useState(2);
  const [participantNames, setParticipantNames] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if profile exists when component mounts
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profile) {
          toast({
            title: "Error",
            description: "Profile not found. Please try logging out and back in.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to check profile. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (userId) {
      checkProfile();
    }
  }, [userId, toast]);

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
      // First, verify that the user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        toast({
          title: "Error",
          description: "Profile not found. Please try logging out and back in.",
          variant: "destructive",
        });
        return;
      }

      // Now create the draft
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create draft. Please try again.",
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
        onEventChange={onEventChange}
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