import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DraftTimer } from "@/components/DraftTimer";
import { DraftOrder } from "@/components/DraftOrder";
import { DraftTeamList } from "@/components/draft/DraftTeamList";
import { useDraftState } from "@/components/draft/DraftStateProvider";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface DraftParticipant {
  name: string;
  teams: Array<{
    teamNumber: number;
    teamName: string;
  }>;
}

export const DraftContent = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { draftState, setDraftState } = useDraftState();

  const { data: draftData, isLoading } = useQuery({
    queryKey: ['draft', draftId],
    queryFn: async () => {
      if (!draftId) return null;
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', draftId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!draftId,
  });

  const handleTeamSelect = async (team: any) => {
    setDraftState(prev => ({
      ...prev,
      currentParticipantIndex: (prev.currentParticipantIndex + 1) % prev.participants.length,
      timeRemaining: 120,
    }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading draft...</div>;
  }

  if (!draftData) {
    return <div className="flex items-center justify-center min-h-screen">Draft not found</div>;
  }

  // Parse and validate participants data with proper type checking
  const participants: DraftParticipant[] = Array.isArray(draftData.participants) 
    ? (draftData.participants as any[]).map(p => ({
        name: p.name || '',
        teams: Array.isArray(p.teams) ? p.teams.map(t => ({
          teamNumber: t.teamNumber || 0,
          teamName: t.teamName || ''
        })) : []
      }))
    : [];

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No participants found in this draft
      </div>
    );
  }

  // Ensure currentParticipantIndex is within bounds
  const currentIndex = Math.min(
    Math.max(0, draftState.currentParticipantIndex),
    participants.length - 1
  );

  const currentParticipant = participants[currentIndex];
  
  if (!currentParticipant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error: Could not determine current participant. Please try refreshing the page.
      </div>
    );
  }

  const availableTeams = ((draftData.draft_data as { availableTeams?: any[] })?.availableTeams) || [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold">{draftData.event_name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <DraftOrder
                participants={participants}
                currentIndex={currentIndex}
              />
            </div>
            <div>
              <DraftTimer
                key={currentIndex}
                onTimeUp={() => handleTeamSelect(null)}
                isActive={true}
              />
            </div>
          </div>

          <DraftTeamList
            draftId={draftId!}
            availableTeams={availableTeams}
            currentParticipant={currentParticipant.name}
            onTeamSelect={handleTeamSelect}
          />
        </motion.div>
      </div>
    </div>
  );
};