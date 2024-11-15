import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { DraftTimer } from "@/components/DraftTimer";
import { DraftOrder } from "@/components/DraftOrder";
import { DraftTeamList } from "@/components/draft/DraftTeamList";
import { DraftComplete } from "@/components/DraftComplete";
import { useDraftState } from "@/components/draft/DraftStateProvider";
import { useToast } from "@/components/ui/use-toast";
import { useDraftData } from "@/hooks/useDraftData";
import { selectTeam } from "@/services/draftService";
import { Team } from "@/types/draft";
import { useQuery } from "@tanstack/react-query";
import { fetchEventTeams } from "@/services/tbaService";
import { Button } from "@/components/ui/button";

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
      const { updatedParticipants, updatedAvailableTeams } = await selectTeam(
        draftId,
        team,
        draftState.participants,
        currentParticipant.name,
        teams || []
      );

      setDraftState(prev => ({
        ...prev,
        participants: updatedParticipants,
        currentParticipantIndex: (prev.currentParticipantIndex + 1) % prev.participants.length
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

  if ((!draftState.participants || draftState.participants.length === 0) && draftData.participants) {
    setDraftState(prev => ({
      ...prev,
      participants: draftData.participants.map((p: any) => ({
        name: p.name,
        teams: p.teams || []
      }))
    }));
    return <div className="flex items-center justify-center min-h-screen">Initializing draft...</div>;
  }

  if (!draftState.participants || draftState.participants.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">No participants found</div>;
  }

  const participants = draftState.participants;
  const currentIndex = draftState.currentParticipantIndex;
  const currentParticipant = participants[currentIndex];

  if (!currentParticipant) {
    return <div className="flex items-center justify-center min-h-screen">Invalid participant state</div>;
  }

  if (draftState.draftComplete) {
    // Transform the participants data to include ranking
    const participantsWithRanking = draftState.participants.map(participant => ({
      name: participant.name,
      teams: participant.teams.map(team => ({
        teamNumber: team.teamNumber,
        teamName: team.teamName,
        stats: {
          wins: team.stats.wins,
          losses: team.stats.losses,
          ranking: Math.floor(Math.random() * 100) // Placeholder ranking calculation
        }
      }))
    }));
    return <DraftComplete participants={participantsWithRanking} />;
  }

  const availableTeams = teams || [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{draftData.event_name}</h1>
            {isDraftComplete && (
              <Button 
                onClick={handleCompleteDraft}
                className="bg-green-500 hover:bg-green-600"
              >
                Complete Draft
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <DraftOrder
                participants={participants}
                currentIndex={currentIndex}
              />
            </div>
            <div>
              {!isDraftComplete && (
                <DraftTimer
                  key={currentIndex}
                  onTimeUp={() => {}}
                  isActive={true}
                />
              )}
            </div>
          </div>

          <DraftTeamList
            draftId={draftId}
            availableTeams={availableTeams}
            currentParticipant={currentParticipant.name}
            onTeamSelect={handleTeamSelect}
            hidePoints={true}
          />
        </motion.div>
      </div>
    </div>
  );
};
