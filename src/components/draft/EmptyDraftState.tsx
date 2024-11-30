import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DraftTeamList } from "./DraftTeamList";
import { Team } from "@/types/draft";

interface EmptyDraftStateProps {
  draftId: string;
  teams: Team[];
}

export const EmptyDraftState = ({ draftId, teams }: EmptyDraftStateProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <p className="text-lg text-muted-foreground">No participants found in this draft.</p>
        <Link to="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
      {teams && teams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Teams in this event:</h2>
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