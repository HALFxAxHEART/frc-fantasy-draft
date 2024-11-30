import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { DraftControls } from "./DraftControls";
import { EventSelector } from "@/components/EventSelector";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

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
  const [teams, setTeams] = useState<Team[]>([]);
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
    setTeams([...teams, { name: "", participants: [] }]);
  };

  const removeTeam = (index: number) => {
    const newTeams = [...teams];
    newTeams.splice(index, 1);
    setTeams(newTeams);
  };

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  };

  const addParticipantToTeam = (teamIndex: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants.push("");
    setTeams(newTeams);
  };

  const removeParticipantFromTeam = (teamIndex: number, participantIndex: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants.splice(participantIndex, 1);
    setTeams(newTeams);
  };

  const updateParticipant = (teamIndex: number, participantIndex: number, name: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants[participantIndex] = name;
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

    if (teams.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one team",
        variant: "destructive",
      });
      return;
    }

    if (teams.some(team => !team.name || team.participants.length === 0)) {
      toast({
        title: "Error",
        description: "All teams must have a name and at least one participant",
        variant: "destructive",
      });
      return;
    }

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
        return;
      }

      const { data, error: draftError } = await supabase
        .from('drafts')
        .insert({
          user_id: userId,
          event_key: selectedEvent,
          event_name: events?.find(e => e.key === selectedEvent)?.name || selectedEvent,
          status: 'active',
          teams: teams,
          nickname: draftNickname || null,
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
              <h3 className="text-lg font-semibold">Teams</h3>
              <Button onClick={addTeam} size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Add Team
              </Button>
            </div>

            <div className="space-y-4">
              {teams.map((team, teamIndex) => (
                <Card key={teamIndex} className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Label htmlFor={`team-${teamIndex}`}>Team Name</Label>
                      <Input
                        id={`team-${teamIndex}`}
                        value={team.name}
                        onChange={(e) => updateTeamName(teamIndex, e.target.value)}
                        placeholder="Enter team name"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTeam(teamIndex)}
                      className="mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Participants</Label>
                      <Button
                        onClick={() => addParticipantToTeam(teamIndex)}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" /> Add Participant
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {team.participants.map((participant, participantIndex) => (
                        <div key={participantIndex} className="flex items-center gap-2">
                          <Input
                            value={participant}
                            onChange={(e) =>
                              updateParticipant(teamIndex, participantIndex, e.target.value)
                            }
                            placeholder="Enter participant name"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeParticipantFromTeam(teamIndex, participantIndex)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
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