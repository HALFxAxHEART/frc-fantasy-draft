import { useParams } from "react-router-dom";
import { DraftTimer } from "@/components/DraftTimer";
import { DraftOrder } from "@/components/DraftOrder";
import { DraftComplete } from "@/components/DraftComplete";
import { DraftSetup } from "@/components/DraftSetup";
import { useDraftState } from "@/components/draft/DraftStateProvider";
import { useToast } from "@/components/ui/use-toast";
import { useDraftData } from "@/hooks/useDraftData";
import { selectTeam } from "@/services/draftService";
import { Team } from "@/types/draft";
import { useQuery } from "@tanstack/react-query";
import { fetchEventTeams, fetchEventDetails } from "@/services/tbaService";
import { DraftHeader } from "./DraftHeader";
import { DraftLayout } from "./DraftLayout";
import { DraftTeamGrid } from "./DraftTeamGrid";
import confetti from 'canvas-confetti';
import { DraftCompleteDialog } from "./DraftCompleteDialog";
import { Loader2 } from "lucide-react";

export const DraftContent = () => {
  const { draftId } = useParams();
  const { toast } = useToast();
  const { draftState, setDraftState } = useDraftState();
  const { data: draftData, isLoading: isDraftLoading } = useDraftData(draftId);

  // Get draft settings from localStorage
  const draftSettings = JSON.parse(localStorage.getItem("draftSettings") || "{}");
  const timeLimit = draftSettings.draftTimeLimit || 120;

  const { data: teams, isLoading: isTeamsLoading } = useQuery({
    queryKey: ['eventTeams', draftData?.event_key],
    queryFn: () => fetchEventTeams(draftData?.event_key || ''),
    enabled: !!draftData?.event_key,
  });

  const { data: eventDetails } = useQuery({
    queryKey: ['eventDetails', draftData?.event_key],
    queryFn: () => fetchEventDetails(draftData?.event_key || ''),
    enabled: !!draftData?.event_key,
  });

  const isDraftComplete = draftState.participants.every(p => p.teams.length >= 5);
  const isLoading = isDraftLoading || isTeamsLoading;

  const handleTeamSelect = async (team: Team) => {
    const currentParticipant = draftState.participants[draftState.currentParticipantIndex];
    
    try {
      const { updatedParticipants } = await selectTeam(
        draftId || '',
        team,
        draftState.participants,
        currentParticipant.name,
        teams || []
      );

      const totalPicks = updatedParticipants.reduce((sum, p) => sum + p.teams.length, 0);
      const round = Math.floor(totalPicks / updatedParticipants.length) + 1;
      const isReverseRound = round % 2 === 0;

      let nextIndex = isReverseRound
        ? draftState.currentParticipantIndex - 1
        : draftState.currentParticipantIndex + 1;

      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= updatedParticipants.length) {
        nextIndex = updatedParticipants.length - 1;
      }

      setDraftState(prev => ({
        ...prev,
        participants: updatedParticipants,
        currentParticipantIndex: nextIndex
      }));

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading draft...</span>
      </div>
    );
  }

  if (!draftData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Draft not found</span>
      </div>
    );
  }

  if (!draftState.participants || draftState.participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <h2 className="text-2xl font-bold">Loading participants...</h2>
        <p className="text-muted-foreground">Please wait while we set up your draft.</p>
      </div>
    );
  }

  if (!draftState.draftStarted) {
    return (
      <DraftSetup
        participants={draftState.participants}
        onStartDraft={() => setDraftState(prev => ({ ...prev, draftStarted: true }))}
      />
    );
  }

  if (isDraftComplete && eventDetails) {
    return <DraftCompleteDialog draftState={draftState} eventDetails={eventDetails} />;
  }

  return (
    <DraftLayout>
      <DraftHeader 
        eventName={draftData.event_name} 
        nickname={draftData.nickname} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <DraftOrder
            participants={draftState.participants}
            currentIndex={draftState.currentParticipantIndex}
            round={Math.floor(draftState.participants.reduce((sum, p) => sum + p.teams.length, 0) / draftState.participants.length) + 1}
          />
        </div>
        <div>
          {!isDraftComplete && !isTeamsLoading && teams && (
            <DraftTimer
              key={draftState.currentParticipantIndex}
              onTimeUp={() => handleTeamSelect(teams[0])}
              isActive={true}
              autoSelectTeam={() => handleTeamSelect(teams[0])}
              initialTime={timeLimit}
            />
          )}
        </div>
      </div>

      {teams && (
        <DraftTeamGrid
          teams={teams}
          isLoading={isTeamsLoading}
          onTeamSelect={handleTeamSelect}
          hidePoints={true}
        />
      )}
    </DraftLayout>
  );
};