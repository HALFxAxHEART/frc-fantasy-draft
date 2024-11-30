import React from "react";
import { useParams } from "react-router-dom";
import { DraftComplete } from "@/components/DraftComplete";
import { DraftSetup } from "@/components/DraftSetup";
import { useDraftState } from "./DraftStateProvider";
import { useToast } from "@/components/ui/use-toast";
import { useDraftData } from "@/hooks/useDraftData";
import { selectTeam } from "@/services/draftService";
import { useQuery } from "@tanstack/react-query";
import { fetchEventTeams } from "@/services/tbaService";
import { DraftErrorState } from "./DraftErrorState";
import { DraftGameInterface } from "./DraftGameInterface";
import { DraftLayout } from "./DraftLayout";
import { Team } from "@/types/draft";
import { DraftLoadingState } from "./DraftLoadingState";

export const DraftContent = () => {
  const { draftId } = useParams();
  const { toast } = useToast();
  const { draftState, setDraftState } = useDraftState();
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  
  const { data: draftData, isLoading: isDraftLoading } = useDraftData(draftId);
  
  const { data: teams, isLoading: isTeamsLoading, error: teamsError } = useQuery({
    queryKey: ['eventTeams', draftData?.event_key],
    queryFn: async () => {
      const teams = await fetchEventTeams(draftData?.event_key || '');
      let progress = 0;
      const increment = 100 / teams.length;
      
      const processedTeams = teams.map((team, index) => {
        progress += increment;
        setLoadingProgress(Math.min(Math.round(progress), 100));
        return team;
      });

      return processedTeams;
    },
    enabled: !!draftData?.event_key,
    meta: {
      onSuccess: (data: any) => {
        console.log('Teams loaded for event:', draftData?.event_key);
        console.log('Team data:', data.map((team: any) => ({
          number: team.teamNumber,
          name: team.teamName
        })));
        setLoadingProgress(100);
      },
      onError: (error: Error) => {
        console.error('Error loading teams:', error);
        toast({
          title: "Error Loading Teams",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });

  // Initialize draft state with participants and event data
  React.useEffect(() => {
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
    return (
      <DraftLoadingState
        isLoadingDraft={isDraftLoading}
        isLoadingTeams={isTeamsLoading}
        loadingProgress={loadingProgress}
      />
    );
  }

  if (teamsError) {
    return (
      <DraftErrorState
        title="Error Loading Teams"
        message="Failed to load teams from The Blue Alliance. Please try again later."
      />
    );
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

  if (!draftState.teams || draftState.teams.length === 0) {
    return (
      <DraftLoadingState
        isLoadingDraft={true}
        isLoadingTeams={false}
        loadingProgress={loadingProgress}
      />
    );
  }

  const currentTeam = draftState.teams[draftState.currentTeamIndex];

  if (!currentTeam) {
    return (
      <DraftErrorState
        title="No Participants Found"
        message="No participants were found for this draft. Please check the draft settings and try again."
      />
    );
  }

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
            onStartDraft={() => setDraftState(prev => ({ ...prev, draftStarted: true }))}
          />
        ) : (
          <DraftGameInterface
            draftId={draftId || ''}
            teams={teams}
            draftState={draftState}
            currentTeam={currentTeam}
            onTeamSelect={async (team: Team) => {
              try {
                const { updatedParticipants } = await selectTeam(
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
            }}
          />
        )}
      </div>
    </DraftLayout>
  );
};