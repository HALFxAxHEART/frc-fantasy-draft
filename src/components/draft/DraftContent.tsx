import { useParams } from "react-router-dom";
import { DraftComplete } from "@/components/DraftComplete";
import { DraftSetup } from "@/components/DraftSetup";
import { useDraftState } from "./DraftStateProvider";
import { useToast } from "@/components/ui/use-toast";
import { useDraftData } from "@/hooks/useDraftData";
import { selectTeam } from "@/services/draftService";
import { useQuery } from "@tanstack/react-query";
import { fetchEventTeams } from "@/services/tbaService";
import { DraftLoadingState } from "./DraftLoadingState";
import { DraftLayout } from "./DraftLayout";
import { DraftErrorState } from "./DraftErrorState";
import { DraftGameInterface } from "./DraftGameInterface";
import { supabase } from "@/integrations/supabase/client";
import { Team } from "@/types/draft";
import { useEffect } from "react";

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

  // Initialize draft state with participants and event data
  useEffect(() => {
    if (draftData?.participants && draftData?.event_key) {
      const initialTeams = draftData.participants.map(participant => ({
        name: participant.name,
        teams: participant.teams || []
      }));

      setDraftState(prev => ({
        ...prev,
        teams: initialTeams,
        selectedEvent: draftData.event_key,
        draftStarted: false,
        currentTeamIndex: 0,
        draftComplete: false
      }));
    }
  }, [draftData, setDraftState]);

  if (isDraftLoading || isTeamsLoading) {
    return <DraftLoadingState />;
  }

  if (!draftData) {
    return (
      <DraftErrorState
        title="Draft Not Found"
        message="The requested draft could not be found."
      />
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <DraftErrorState
        title="No Teams Available"
        message="No teams were found for this event. Please try again later."
      />
    );
  }

  // Check if we have participants in the draft state
  if (!draftState.teams || draftState.teams.length === 0) {
    return (
      <DraftErrorState
        title="Loading Participants"
        message="Please wait while we load the participants..."
      />
    );
  }

  const currentTeam = draftState.teams[draftState.currentTeamIndex];

  // Only show no participants error if we still don't have a current team
  if (!currentTeam) {
    return (
      <DraftErrorState
        title="No Participants Found"
        message="No participants were found for this draft. Please check the draft settings and try again."
      />
    );
  }

  const handleTeamSelect = async (team: Team) => {
    try {
      const { updatedParticipants, updatedAvailableTeams } = await selectTeam(
        draftId || '',
        team,
        draftState.teams,
        currentTeam.name,
        teams || []
      );

      const nextIndex = (draftState.currentTeamIndex + 1) % draftState.teams.length;
      const isComplete = updatedParticipants.every(t => t.teams && t.teams.length >= 5);

      setDraftState(prev => ({
        ...prev,
        teams: updatedParticipants,
        currentTeamIndex: nextIndex,
        draftComplete: isComplete
      }));

      if (!isComplete) {
        toast({
          title: "Team Selected",
          description: `${team.teamName} has been drafted by ${currentTeam.name}`
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

  const handleStartDraft = async () => {
    try {
      const { error } = await supabase
        .from('drafts')
        .update({ status: 'active' })
        .eq('id', draftId);

      if (error) throw error;

      setDraftState(prev => ({ ...prev, draftStarted: true }));
      toast({
        title: "Draft Started",
        description: "Let the draft begin!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start the draft",
        variant: "destructive"
      });
    }
  };

  return (
    <DraftLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">
          {draftData?.nickname ? `${draftData.nickname} - ${draftData.event_name}` : draftData?.event_name}
        </h1>
        
        {draftState.draftComplete ? (
          <DraftComplete 
            draftId={draftId || ''} 
            participants={draftState.teams}
            eventName={draftData.event_name}
          />
        ) : !draftState.draftStarted ? (
          <DraftSetup
            teams={draftState.teams.map(team => ({
              name: team.name,
              participants: [team.name]
            }))}
            onStartDraft={handleStartDraft}
          />
        ) : (
          <DraftGameInterface
            draftId={draftId || ''}
            teams={teams}
            draftState={draftState}
            currentTeam={currentTeam}
            onTeamSelect={handleTeamSelect}
          />
        )}
      </div>
    </DraftLayout>
  );
};