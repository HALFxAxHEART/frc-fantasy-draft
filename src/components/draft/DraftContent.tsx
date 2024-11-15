import { useParams } from "react-router-dom";
import { DraftTimer } from "@/components/DraftTimer";
import { DraftOrder } from "@/components/DraftOrder";
import { DraftTeamList } from "@/components/draft/DraftTeamList";
import { DraftComplete } from "@/components/DraftComplete";
import { DraftSetup } from "@/components/DraftSetup";
import { useDraftState } from "@/components/draft/DraftStateProvider";
import { useToast } from "@/components/ui/use-toast";
import { useDraftData } from "@/hooks/useDraftData";
import { selectTeam } from "@/services/draftService";
import { Team } from "@/types/draft";
import { useQuery } from "@tanstack/react-query";
import { fetchEventTeams } from "@/services/tbaService";
import { Button } from "@/components/ui/button";
import { DraftHeader } from "./DraftHeader";
import { DraftLayout } from "./DraftLayout";
import confetti from 'canvas-confetti';

export const DraftContent = () => {
  const { draftId } = useParams();
  const { toast } = useToast();
  const { draftState, setDraftState } = useDraftState();
  const { data: draftData, isLoading: isDraftLoading, refetch } = useDraftData(draftId);

  const { data: teams, isLoading: isTeamsLoading } = useQuery({
    queryKey: ['eventTeams', draftData?.event_key],
    queryFn: () => fetchEventTeams(draftData?.event_key || ''),
    enabled: !!draftData?.event_key,
  });

  const isDraftComplete = draftState.participants.every(p => p.teams.length >= 5);

  const handleCompleteDraft = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setDraftState(prev => ({
      ...prev,
      draftComplete: true
    }));
  };

  const handleTeamSelect = async (team: Team) => {
    if (!draftId || !draftData) return;

    const currentParticipant = draftState.participants[draftState.currentParticipantIndex];
    if (!currentParticipant) {
      toast({
        title: "Error",
        description: "No active participant found",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { updatedParticipants } = await selectTeam(
        draftId,
        team,
        draftState.participants,
        currentParticipant.name,
        teams || []
      );

      // Calculate next picker based on snake draft pattern
      const totalPicks = updatedParticipants.reduce((sum, p) => sum + p.teams.length, 0);
      const round = Math.floor(totalPicks / updatedParticipants.length) + 1;
      const isReverseRound = round % 2 === 0;
      
      let nextIndex;
      if (isReverseRound) {
        nextIndex = draftState.currentParticipantIndex - 1;
        if (nextIndex < 0) {
          nextIndex = 0; // Start next forward round
        }
      } else {
        nextIndex = draftState.currentParticipantIndex + 1;
        if (nextIndex >= updatedParticipants.length) {
          nextIndex = updatedParticipants.length - 1; // Start next reverse round
        }
      }

      setDraftState(prev => ({
        ...prev,
        participants: updatedParticipants,
        currentParticipantIndex: nextIndex
      }));

      refetch();

      toast({
        title: "Team Selected",
        description: `${team.teamName} has been drafted by ${currentParticipant.name}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isDraftLoading || isTeamsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading draft...</div>;
  }

  if (!draftData) {
    return <div className="flex items-center justify-center min-h-screen">Draft not found</div>;
  }

  if (!draftState.participants || draftState.participants.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">No participants found</div>;
  }

  if (!draftState.draftStarted) {
    return (
      <DraftSetup
        participants={draftState.participants}
        onStartDraft={() => setDraftState(prev => ({ ...prev, draftStarted: true }))}
      />
    );
  }

  if (draftState.draftComplete) {
    return <DraftComplete participants={draftState.participants} />;
  }

  const availableTeams = teams || [];

  return (
    <DraftLayout>
      <DraftHeader eventName={draftData.event_name} nickname={draftData.nickname} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <DraftOrder
            participants={draftState.participants}
            currentIndex={draftState.currentParticipantIndex}
            round={Math.floor(draftState.participants.reduce((sum, p) => sum + p.teams.length, 0) / draftState.participants.length) + 1}
          />
        </div>
        <div className="space-y-4">
          {!isDraftComplete && (
            <DraftTimer
              key={draftState.currentParticipantIndex}
              onTimeUp={() => {}}
              isActive={true}
            />
          )}
          {isDraftComplete && (
            <Button 
              onClick={handleCompleteDraft}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Complete Draft
            </Button>
          )}
        </div>
      </div>

      <DraftTeamList
        draftId={draftId}
        availableTeams={availableTeams}
        currentParticipant={draftState.participants[draftState.currentParticipantIndex].name}
        onTeamSelect={handleTeamSelect}
        hidePoints={true}
      />
    </DraftLayout>
  );
};