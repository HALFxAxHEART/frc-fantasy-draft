import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DraftTeam } from "@/types/draftCreation";
import { Users, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useDraftState } from "./DraftStateProvider";
import { Team } from "@/types/draft";
import { TeamCard } from "@/components/TeamCard";

interface TeamListProps {
  draftId: string;
  availableTeams: Team[];
  currentParticipant: string;
  onTeamSelect: (team: Team) => Promise<void>;
}

export const DraftTeamList = ({
  draftId,
  availableTeams,
  currentParticipant,
  onTeamSelect,
}: TeamListProps) => {
  const { toast } = useToast();
  const { draftState } = useDraftState();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Teams</h3>
            <span className="text-sm text-muted-foreground">
              {currentParticipant}'s turn
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableTeams.map((team) => (
              <TeamCard
                key={team.teamNumber}
                teamNumber={team.teamNumber}
                teamName={team.teamName}
                districtPoints={team.districtPoints}
                stats={team.stats}
                onSelect={() => onTeamSelect(team)}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};