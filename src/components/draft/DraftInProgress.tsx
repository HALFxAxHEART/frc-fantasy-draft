import { DraftTimer } from "@/components/DraftTimer";
import { DraftOrder } from "@/components/DraftOrder";
import { DraftTeamList } from "./DraftTeamList";
import { Team } from "@/types/draft";
import { useToast } from "@/components/ui/use-toast";

interface DraftInProgressProps {
  draftId: string;
  teams: Team[];
  currentParticipant: { name: string };
  draftState: any;
  setDraftState: (state: any) => void;
}

export const DraftInProgress = ({
  draftId,
  teams,
  currentParticipant,
  draftState,
  setDraftState,
}: DraftInProgressProps) => {
  const { toast } = useToast();

  const handleTeamSelect = async (team: Team) => {
    try {
      const nextIndex = (draftState.currentParticipantIndex + 1) % draftState.participants.length;
      const isComplete = draftState.participants.every((p: any) => p.teams.length >= 5);

      setDraftState((prev: any) => ({
        ...prev,
        currentParticipantIndex: nextIndex,
        draftComplete: isComplete
      }));

      if (!isComplete) {
        toast({
          title: "Team Selected",
          description: `${team.teamName} has been drafted by ${currentParticipant.name}`
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <DraftTimer
        onTimeUp={() => {}}
        isActive={!draftState.draftComplete}
        autoSelectTeam={() => teams && handleTeamSelect(teams[0])}
      />
      
      <DraftOrder
        teams={draftState.teams}
        currentIndex={draftState.currentTeamIndex}
      />

      <DraftTeamList
        draftId={draftId}
        availableTeams={teams || []}
        currentParticipant={currentParticipant.name}
        onTeamSelect={handleTeamSelect}
      />
    </div>
  );
};