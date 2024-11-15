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
import { fetchEventTeams, fetchEventDetails } from "@/services/tbaService";
import { DraftHeader } from "./DraftHeader";
import { DraftLayout } from "./DraftLayout";
import confetti from 'canvas-confetti';
import { DraftCompleteDialog } from "./DraftCompleteDialog";

export const DraftContent = () => {
  const { draftId } = useParams();
  const { toast } = useToast();
  const { draftState, setDraftState } = useDraftState();
  const { data: draftData, isLoading: isDraftLoading, refetch } = useDraftData(draftId);

  // Get draft settings from localStorage
  const draftSettings = JSON.parse(localStorage.getItem("draftSettings") || "{}");
  const timeLimit = draftSettings.draftTimeLimit || 120; // Default to 120 seconds if not set

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

  const handleAutoSelectTeam = async () => {
    if (!teams) return;
    
    const availableTeams = teams.filter(team => 
      !draftState.participants.some(p => 
        p.teams.some(t => t.teamNumber === team.teamNumber)
      )
    );

    if (availableTeams.length > 0) {
      await handleTeamSelect(availableTeams[0]);
    }
  };

  const handleTeamSelect = async (team: Team) => {
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
          nextIndex = 0;
        }
      } else {
        nextIndex = draftState.currentParticipantIndex + 1;
        if (nextIndex >= updatedParticipants.length) {
          nextIndex = updatedParticipants.length - 1;
        }
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
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
              onTimeUp={handleAutoSelectTeam}
              isActive={true}
              autoSelectTeam={handleAutoSelectTeam}
              initialTime={timeLimit}
            />
          )}
        </div>
      </div>

      {teams && teams.length > 0 ? (
        <DraftTeamList
          draftId={draftId}
          availableTeams={teams}
          currentParticipant={draftState.participants[draftState.currentParticipantIndex].name}
          onTeamSelect={handleTeamSelect}
          hidePoints={true}
        />
      ) : (
        <div className="text-center p-4 mt-4">
          <p className="text-lg text-muted-foreground">No teams available for this event yet.</p>
        </div>
      )}
    </DraftLayout>
  );
};