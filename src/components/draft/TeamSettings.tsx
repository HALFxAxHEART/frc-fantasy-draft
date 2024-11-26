import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface TeamSettingsProps {
  numberOfTeams: number;
  participantsPerTeam: number;
  onTeamsChange: (value: number) => void;
  onParticipantsPerTeamChange: (value: number) => void;
}

export const TeamSettings = ({
  numberOfTeams,
  participantsPerTeam,
  onTeamsChange,
  onParticipantsPerTeamChange,
}: TeamSettingsProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="space-y-2">
        <Label>Number of Teams (2-10)</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onTeamsChange(numberOfTeams - 1)}
            disabled={numberOfTeams <= 2}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium">{numberOfTeams}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onTeamsChange(numberOfTeams + 1)}
            disabled={numberOfTeams >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Participants per Team (1-5)</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onParticipantsPerTeamChange(participantsPerTeam - 1)}
            disabled={participantsPerTeam <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium">{participantsPerTeam}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onParticipantsPerTeamChange(participantsPerTeam + 1)}
            disabled={participantsPerTeam >= 5}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};