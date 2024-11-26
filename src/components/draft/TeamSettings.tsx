import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface TeamSettingsProps {
  numberOfTeams: number;
  onTeamsChange: (value: number) => void;
}

export const TeamSettings = ({
  numberOfTeams,
  onTeamsChange,
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
    </div>
  );
};