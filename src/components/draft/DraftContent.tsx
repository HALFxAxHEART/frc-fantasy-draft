import { useParams } from "react-router-dom";
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
import { DraftLeaderboard } from "@/components/DraftLeaderboard";
import { useEffect } from "react";

export const DraftContent = () => {
  const { draftId } = useParams();
  const { toast } = useToast();
  const { draftState, setDraftState } = useDraftState();
  
  const { data: draftData, isLoading: isDraftLoading, error: draftError } = useDraftData(draftId);
  const { data: teams, isLoading: isTeamsLoading, error: teamsError } = useQuery({
    queryKey: ['eventTeams', draftData?.event_key],
    queryFn: () => fetchEventTeams(draftData?.event_key || ''),
    enabled: !!draftData?.event_key,
  });

  useEffect(() => {
    if (draftData && draftData.participants) {
      setDraftState(prev => ({
        ...prev,
        participants: draftData.participants,
        currentParticipantIndex: 0,
        draftStarted: false,
        draftComplete: false
      }));
    }
  }, [draftData, setDraftState]);

  if (isDraftLoading || isTeamsLoading) {
    return <DraftLoadingState />;
  }

  if (draftError || teamsError) {
    console.error('Draft Error:', draftError);
    console.error('Teams Error:', teamsError);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-lg text-red-600">
            {draftError ? 'Error loading draft data' : 'Error loading teams data'}
          </p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!draftData) {
    console.error('No draft data available');
    return (
      <DraftLayout>
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">Draft not found. Please return to dashboard.</p>
        </div>
      </DraftLayout>
    );
  }

  if (!draftData.participants || draftData.participants.length === 0) {
    console.error('No participants in draft data:', draftData);
    return (
      <DraftLayout>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">
            {draftData.nickname ? `${draftData.nickname} - ${draftData.event_name}` : draftData.event_name}
          </h1>
          <div className="text-center p-8">
            <p className="text-lg text-muted-foreground">No participants found. Please return to dashboard and try again.</p>
          </div>
        </div>
      </DraftLayout>
    );
  }

  const currentParticipant = draftState.participants[draftState.currentParticipantIndex];
  if (!currentParticipant) {
    setDraftState(prev => ({
      ...prev,
      currentParticipantIndex: 0
    }));
    return null;
  }

  const handleTeamSelect = async (team: Team) => {
    try {
      const { updatedParticipants } = await selectTeam(
        draftId || '',
        team,
        draftState.participants,
        currentParticipant.name,
        teams
      );

      const nextIndex = (draftState.currentParticipantIndex + 1) % draftState.participants.length;
      const isComplete = updatedParticipants.every(p => p.teams.length >= 5);

      setDraftState(prev => ({
        ...prev,
        participants: updatedParticipants,
        currentParticipantIndex: nextIndex,
        draftComplete: isComplete
      }));

      if (!isComplete) {
        toast({
          title: "Team Selected",
          description: `${team.teamName} has been drafted`
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

  if (draftState.draftComplete) {
    return (
      <>
        <DraftComplete draftId={draftId || ''} participants={draftState.participants} />
        <div className="mt-8">
          <DraftLeaderboard draftId={draftId || ''} />
        </div>
      </>
    );
  }

  return (
    <DraftLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">
          {draftData?.nickname ? `${draftData.nickname} - ${draftData.event_name}` : draftData?.event_name}
        </h1>
        
        {!draftState.draftStarted ? (
          <DraftSetup
            participants={draftState.participants}
            onStartDraft={() => setDraftState(prev => ({ ...prev, draftStarted: true }))}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <DraftOrder
                  participants={draftState.participants}
                  currentIndex={draftState.currentParticipantIndex}
                />
              </div>
              <div>
                <DraftLeaderboard draftId={draftId || ''} />
              </div>
            </div>

            <DraftTeamList
              draftId={draftId || ''}
              availableTeams={teams || []}
              currentParticipant={currentParticipant.name}
              onTeamSelect={handleTeamSelect}
            />
          </>
        )}
      </div>
    </DraftLayout>
  );
};