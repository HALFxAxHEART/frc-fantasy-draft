import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DraftTeamList } from "./DraftTeamList";
import { Team } from "@/types/draft";
import { DraftOrder } from "@/components/DraftOrder";
import { useDraftState } from "./DraftStateProvider";

interface EmptyDraftStateProps {
  draftId: string;
  teams: Team[];
}

export const EmptyDraftState = ({ draftId, teams }: EmptyDraftStateProps) => {
  const { draftState } = useDraftState();

  // Create a participant list from teams
  const teamParticipants = teams.map(team => ({
    name: `Team ${team.teamNumber}`,
    teams: []
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <DraftOrder
            participants={teamParticipants}
            currentIndex={draftState.currentParticipantIndex}
          />
        </div>
        <div className="flex items-center justify-center">
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      {teams && teams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Teams:</h2>
          <DraftTeamList
            draftId={draftId}
            availableTeams={teams}
            currentParticipant=""
            onTeamSelect={() => {}}
            hidePoints
          />
        </div>
      )}
    </div>
  );
};