import { DraftOrder } from "@/components/DraftOrder";
import { DraftTeamList } from "./DraftTeamList";
import { DraftLeaderboard } from "@/components/DraftLeaderboard";
import { Team, DraftParticipant } from "@/types/draft";

interface DraftGameInterfaceProps {
  draftId: string;
  teams: Team[];
  draftState: {
    teams: DraftParticipant[];
    currentTeamIndex: number;
  };
  currentTeam: DraftParticipant;
  onTeamSelect: (team: Team) => Promise<void>;
}

export const DraftGameInterface = ({
  draftId,
  teams,
  draftState,
  currentTeam,
  onTeamSelect,
}: DraftGameInterfaceProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <DraftOrder
            teams={draftState.teams.map(team => ({
              name: team.name,
              participants: [team.name]
            }))}
            currentIndex={draftState.currentTeamIndex}
          />
        </div>
        <div>
          <DraftLeaderboard draftId={draftId} />
        </div>
      </div>

      <DraftTeamList
        draftId={draftId}
        availableTeams={teams}
        currentParticipant={currentTeam.name}
        onTeamSelect={onTeamSelect}
      />
    </div>
  );
};