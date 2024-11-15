import { useParams } from "react-router-dom";
import { DraftTimer } from "@/components/DraftTimer";
import { DraftOrder } from "@/components/DraftOrder";
import { DraftTeamList } from "./DraftTeamList";
import { DraftComplete } from "@/components/DraftComplete";
import { DraftSetup } from "@/components/DraftSetup";
import { useDraftState } from "./DraftStateProvider";
import { useToast } from "@/components/ui/use-toast";
import { useDraftData } from "@/hooks/useDraftData";
import { selectTeam } from "@/services/draftService";
import { Team } from "@/types/draft";
import { useQuery } from "@tanstack/react-query";
import { fetchEventTeams } from "@/services/tbaService";
import { DraftLoadingState } from "./DraftLoadingState";
import { DraftLayout } from "./DraftLayout";
import confetti from 'canvas-confetti';

export const DraftContent = () => {
  const { draftId } = useParams();
  const { toast } = useToast();
  const { draftState, setDraftState } = useDraftState();
  const { data: draftData, isLoading: isDraftLoading } = useDraftData(draftId);

  const { data: teams, isLoading: isTeamsLoading } = useQuery({
    queryKey: ['eventTeams', draftData?.event_key],
    queryFn: () => fetchEventTeams(draftData?.event_key || ''),
    enabled: !!draftData?.event_key,
  });

  if (isDraftLoading || isTeamsLoading) {
    return <DraftLoadingState />;
  }

  if (!draftData || !teams) {
    return <div>Error loading draft data</div>;
  }

  const handleTeamSelect = async (team: Team) => {
    try {
      const { updatedParticipants } = await selectTeam(
        draftId || '',
        team,
        draftState.participants,
        draftState.participants[draftState.currentParticipantIndex].name,
        teams
      );

      setDraftState(prev => ({
        ...prev,
        participants: updatedParticipants,
        currentParticipantIndex: (prev.currentParticipantIndex + 1) % prev.participants.length
      }));

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast({
        title: "Team Selected",
        description: `${team.teamName} has been drafted`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <DraftLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">
          {draftData.nickname ? `${draftData.nickname} - ${draftData.event_name}` : draftData.event_name}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <DraftOrder
              participants={draftState.participants}
              currentIndex={draftState.currentParticipantIndex}
            />
          </div>
          <div className="space-y-4">
            {!draftState.draftComplete && (
              <DraftTimer
                onTimeUp={() => {}}
                isActive={draftState.draftStarted && !draftState.draftComplete}
                autoSelectTeam={() => handleTeamSelect(teams[0])}
              />
            )}
          </div>
        </div>

        {draftState.draftStarted && !draftState.draftComplete && (
          <DraftTeamList
            draftId={draftId}
            availableTeams={teams}
            currentParticipant={draftState.participants[draftState.currentParticipantIndex].name}
            onTeamSelect={handleTeamSelect}
          />
        )}

        {!draftState.draftStarted && (
          <DraftSetup
            participants={draftState.participants}
            onStartDraft={() => setDraftState(prev => ({ ...prev, draftStarted: true }))}
          />
        )}
      </div>
    </DraftLayout>
  );
};