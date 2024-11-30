import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
import { useEffect } from "react";
import { DraftHeader } from "./DraftHeader";
import { EmptyDraftState } from "./EmptyDraftState";

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
      // Randomly shuffle the participants array
      const shuffledParticipants = [...draftData.participants].sort(() => Math.random() - 0.5);
      setDraftState(prev => ({
        ...prev,
        participants: shuffledParticipants,
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
        <div className="text-center p-8 space-y-4">
          <p className="text-lg text-muted-foreground">Draft not found.</p>
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Dashboard
            </Button>
          </Link>
        </div>
      </DraftLayout>
    );
  }

  if (!draftData.participants || draftData.participants.length === 0) {
    return (
      <DraftLayout>
        <div className="space-y-8">
          <DraftHeader 
            nickname={draftData.nickname} 
            eventName={draftData.event_name} 
          />
          <EmptyDraftState 
            draftId={draftId || ''} 
            teams={teams || []} 
          />
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
        teams || []
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

  if (draftState.draftComplete) {
    return <DraftComplete draftId={draftId || ''} participants={draftState.participants} />;
  }

  return (
    <DraftLayout>
      <div className="space-y-8">
        <DraftHeader 
          nickname={draftData.nickname} 
          eventName={draftData.event_name} 
        />
        
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
                <DraftTimer
                  onTimeUp={() => {}}
                  isActive={!draftState.draftComplete}
                  autoSelectTeam={() => teams && handleTeamSelect(teams[0])}
                />
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