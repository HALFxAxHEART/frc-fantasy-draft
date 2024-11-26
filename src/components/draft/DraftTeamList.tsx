import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DraftTeam } from "@/types/draftCreation";
import { Users, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useDraftState } from "./DraftStateProvider";

interface TeamListProps {
  teams: DraftTeam[];
  onTeamNameChange: (index: number, value: string) => void;
  onParticipantChange: (teamIndex: number, participantIndex: number, value: string) => void;
  onParticipantCountChange: (teamIndex: number, change: number) => void;
}

export const DraftTeamList = ({
  teams,
  onTeamNameChange,
  onParticipantChange,
  onParticipantCountChange,
}: TeamListProps) => {
  const { toast } = useToast();
  const { draftState } = useDraftState();

  const handleParticipantCountChange = (teamIndex: number, change: number) => {
    const newCount = teams[teamIndex].participants.length + change;
    if (newCount < 1) {
      toast({
        title: "Invalid number of participants",
        description: "Each team must have at least 1 participant",
        variant: "destructive",
      });
      return;
    }
    if (newCount > 5) {
      toast({
        title: "Invalid number of participants",
        description: "Maximum number of participants per team is 5",
        variant: "destructive",
      });
      return;
    }
    onParticipantCountChange(teamIndex, change);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((team, teamIndex) => (
        <Card key={teamIndex} className="p-4 space-y-4">
          <div>
            <Label className="text-sm font-medium">Team Name</Label>
            <Input
              value={team.name}
              onChange={(e) => onTeamNameChange(teamIndex, e.target.value)}
              placeholder={`Team ${teamIndex + 1}`}
              className="mt-1"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Participants ({team.participants.length})
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleParticipantCountChange(teamIndex, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleParticipantCountChange(teamIndex, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {team.participants.map((participant, participantIndex) => (
              <Input
                key={participantIndex}
                value={participant}
                onChange={(e) => onParticipantChange(teamIndex, participantIndex, e.target.value)}
                placeholder={`Participant ${participantIndex + 1}`}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
