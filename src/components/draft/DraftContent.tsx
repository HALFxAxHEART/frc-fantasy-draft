import { useParams } from "react-router-dom";
import { DraftComplete } from "@/components/DraftComplete";
import { DraftSetup } from "@/components/DraftSetup";
import { useDraftState } from "./DraftStateProvider";
import { useDraftData } from "@/hooks/useDraftData";
import { useQuery } from "@tanstack/react-query";
import { fetchEventTeams } from "@/services/tbaService";
import { DraftLoadingState } from "./DraftLoadingState";
import { DraftLayout } from "./DraftLayout";
import { useEffect } from "react";
import { DraftHeader } from "./DraftHeader";
import { EmptyDraftState } from "./EmptyDraftState";
import { DraftLoadingError } from "./DraftLoadingError";
import { DraftInProgress } from "./DraftInProgress";

export const DraftContent = () => {
  const { draftId } = useParams();
  const { draftState, setDraftState } = useDraftState();
  
  const { data: draftData, isLoading: isDraftLoading, error: draftError } = useDraftData(draftId);
  const { data: teams, isLoading: isTeamsLoading, error: teamsError } = useQuery({
    queryKey: ['eventTeams', draftData?.event_key],
    queryFn: () => fetchEventTeams(draftData?.event_key || ''),
    enabled: !!draftData?.event_key,
  });

  useEffect(() => {
    if (draftData && draftData.participants) {
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
      <DraftLoadingError 
        error={draftError ? 'Error loading draft data' : 'Error loading teams data'} 
      />
    );
  }

  if (!draftData) {
    return (
      <DraftLayout>
        <DraftLoadingError error="Draft not found." />
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
            teams={draftState.teams}
            onStartDraft={() => setDraftState(prev => ({ ...prev, draftStarted: true }))}
          />
        ) : (
          <DraftInProgress
            draftId={draftId || ''}
            teams={teams || []}
            currentParticipant={currentParticipant}
            draftState={draftState}
            setDraftState={setDraftState}
          />
        )}
      </div>
    </DraftLayout>
  );
};