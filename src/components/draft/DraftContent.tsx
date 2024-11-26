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
import { DraftResults } from "@/components/DraftResults";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export const DraftContent = () => {
  const { draftId } = useParams();
  const { toast } = useToast();
  const { draftState, setDraftState } = useDraftState();
  const stateInitialized = useRef(false);
  
  const { data: draftData, isLoading: isDraftLoading, error: draftError } = useDraftData(draftId);
  const { data: teams, isLoading: isTeamsLoading, error: teamsError } = useQuery({
    queryKey: ['eventTeams', draftData?.event_key],
    queryFn: () => fetchEventTeams(draftData?.event_key || ''),
    enabled: !!draftData?.event_key,
  });

  useEffect(() => {
    if (draftData && draftData.participants && !stateInitialized.current) {
      const isComplete = draftData.status === 'completed';
      setDraftState(prev => ({
        ...prev,
        teams: draftData.participants,
        currentTeamIndex: 0,
        draftStarted: draftData.status === 'active',
        draftComplete: isComplete
      }));
      stateInitialized.current = true;
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
    return (
      <DraftLayout>
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">Draft not found. Please return to dashboard.</p>
        </div>
      </DraftLayout>
    );
  }

  if (draftState.draftComplete) {
    return (
      <DraftLayout>
        <DraftResults 
          draftId={draftId || ''} 
          participants={draftState.teams}
          eventName={draftData.event_name}
        />
      </DraftLayout>
    );
  }

  const currentTeam = draftState.teams[draftState.currentTeamIndex];
  if (!currentTeam) {
    return null;
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
        
        {!draftState.draftStarted ? (
          <DraftSetup
            teams={draftState.teams.map(team => ({
              name: team.name,
              participants: [team.name]
            }))}
            onStartDraft={handleStartDraft}
          />
        ) : (
          <>
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
                <DraftLeaderboard draftId={draftId || ''} />
              </div>
            </div>

            <DraftTeamList
              draftId={draftId || ''}
              availableTeams={teams || []}
              currentParticipant={currentTeam.name}
              onTeamSelect={handleTeamSelect}
            />
          </>
        )}
      </div>
    </DraftLayout>
  );
};