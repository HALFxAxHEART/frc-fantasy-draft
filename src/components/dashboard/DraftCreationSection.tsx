import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { EventSelector } from "@/components/EventSelector";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { TeamBox } from "./TeamBox";
import { motion, AnimatePresence } from "framer-motion";

interface Team {
  name: string;
  participants: string[];
}

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
  const [teams, setTeams] = useState<Team[]>([{ name: "", participants: [""] }]);
  const [draftNickname, setDraftNickname] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) throw profileError;

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

  const addTeam = () => {
    setTeams([...teams, { name: "", participants: [""] }]);
  };

  const removeTeam = (index: number) => {
    if (teams.length > 1) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const updateTeam = (index: number, updatedTeam: Team) => {
    const newTeams = [...teams];
    newTeams[index] = updatedTeam;
    setTeams(newTeams);
  };

  const handleStartDraft = async () => {
    if (!selectedEvent) {
      toast({
        title: "Error",
        description: "Please select an event",
        variant: "destructive",
      });
      return;
    }

    if (teams.some(team => !team.name || team.participants.some(p => !p))) {
      toast({
        title: "Error",
        description: "All teams must have a name and all participants must have names",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('drafts')
        .insert({
          user_id: userId,
          event_key: selectedEvent,
          event_name: events?.find(e => e.key === selectedEvent)?.name || selectedEvent,
          status: 'active',
          teams: JSON.stringify(teams),
          nickname: draftNickname || null,
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/draft/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="draftNickname">Draft Nickname (Optional)</Label>
            <Input
              id="draftNickname"
              value={draftNickname}
              onChange={(e) => setDraftNickname(e.target.value)}
              placeholder="Enter a nickname for your draft"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Teams</Label>
              <Button onClick={addTeam} size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Add Team
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <AnimatePresence>
                {teams.map((team, index) => (
                  <TeamBox
                    key={index}
                    index={index}
                    team={team}
                    onUpdate={updateTeam}
                    onRemove={removeTeam}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <Button
            onClick={handleStartDraft}
            className="w-full"
            disabled={teams.length === 0}
          >
            Start Draft
          </Button>
        </div>
      </Card>

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