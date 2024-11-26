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
    <div className="flex items-center gap-4">
      <div className="space-y-2">
        <Label>Number of Teams</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onTeamsChange(numberOfTeams - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{numberOfTeams}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onTeamsChange(numberOfTeams + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Participants per Team</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onParticipantsPerTeamChange(participantsPerTeam - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{participantsPerTeam}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onParticipantsPerTeamChange(participantsPerTeam + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};