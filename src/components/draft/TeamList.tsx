import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DraftTeam } from "@/types/draftCreation";
import { Users } from "lucide-react";

interface TeamListProps {
  teams: DraftTeam[];
  onTeamNameChange: (index: number, value: string) => void;
  onParticipantChange: (teamIndex: number, participantIndex: number, value: string) => void;
}

export const TeamList = ({
  teams,
  onTeamNameChange,
  onParticipantChange,
}: TeamListProps) => {
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
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Participants
            </Label>
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