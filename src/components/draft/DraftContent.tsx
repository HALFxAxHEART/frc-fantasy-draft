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

interface Team {
  teamNumber: number;
  teamName: string;
  districtPoints: number;
  stats: {
    wins: number;
    losses: number;
    opr: number;
    autoAvg: number;
  };
}

interface DraftData {
  participants: DraftParticipant[];
  draft_data: {
    availableTeams: Team[];
  };
  event_name: string;
}

interface DatabaseDraftData {
  participants: Json;
  draft_data: Json;
  event_name: string;
}

export const DraftContent = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { draftState, setDraftState } = useDraftState();

  const { data: draftData, isLoading, refetch } = useQuery({
    queryKey: ['draft', draftId],
    queryFn: async () => {
      if (!draftId) return null;
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', draftId)
        .single();
      
      if (error) throw error;

      const dbData = data as DatabaseDraftData;

      if (dbData?.participants) {
        const parsedParticipants = (dbData.participants as any[]).map(p => ({
          name: p.name || '',
          teams: Array.isArray(p.teams) ? p.teams : []
        }));

        setDraftState(prev => ({
          ...prev,
          participants: parsedParticipants
        }));
      }

      // Create default teams if none exist
      const defaultTeams: Team[] = Array.from({ length: 30 }, (_, i) => ({
        teamNumber: 254 + i,
        teamName: `Team ${254 + i}`,
        districtPoints: Math.floor(Math.random() * 100),
        stats: {
          wins: Math.floor(Math.random() * 10),
          losses: Math.floor(Math.random() * 10),
          opr: Math.random() * 50,
          autoAvg: Math.random() * 10
        }
      }));

      // Parse the draft data
      const availableTeams = dbData?.draft_data && typeof dbData.draft_data === 'object' && 'availableTeams' in dbData.draft_data
        ? (dbData.draft_data.availableTeams as Team[])
        : defaultTeams;

      const typedData: DraftData = {
        participants: (dbData?.participants as any[] || []).map(p => ({
          name: p.name || '',
          teams: Array.isArray(p.teams) ? p.teams : []
        })),
        draft_data: {
          availableTeams
        },
        event_name: dbData?.event_name || ''
      };
      
      return typedData;
    },
    enabled: !!draftId,
  });

  const handleTeamSelect = async (team: Team) => {
    if (!draftId || !draftData) return;

    const currentParticipant = draftState.participants[draftState.currentParticipantIndex];
    
    // Update the participants array with the selected team
    const updatedParticipants = draftState.participants.map(p => 
      p.name === currentParticipant.name
        ? { ...p, teams: [...p.teams, team] }
        : p
    );

    // Remove the selected team from available teams
    const updatedAvailableTeams = draftData.draft_data.availableTeams.filter(
      t => t.teamNumber !== team.teamNumber
    );

    // Update the database with type-safe JSON
    const { error } = await supabase
      .from('drafts')
      .update({
        participants: updatedParticipants as Json,
        draft_data: {
          availableTeams: updatedAvailableTeams
        } as Json
      })
      .eq('id', draftId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update draft",
        variant: "destructive"
      });
      return;
    }

    // Update local state
    setDraftState(prev => ({
      ...prev,
      participants: updatedParticipants,
      currentParticipantIndex: (prev.currentParticipantIndex + 1) % prev.participants.length
    }));

    // Refetch the data to ensure everything is in sync
    refetch();

    toast({
      title: "Team Selected",
      description: `${team.teamName} has been drafted by ${currentParticipant.name}`
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading draft...</div>;
  }

  if (!draftData) {
    return <div className="flex items-center justify-center min-h-screen">Draft not found</div>;
  }

  const participants = draftState.participants;
  const currentIndex = draftState.currentParticipantIndex;
  const currentParticipant = participants[currentIndex];
  const availableTeams = draftData.draft_data.availableTeams;

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
                onTimeUp={() => {}}
                isActive={true}
              />
            </div>
          </div>

          <DraftTeamList
            draftId={draftId}
            availableTeams={availableTeams}
            currentParticipant={currentParticipant.name}
            onTeamSelect={handleTeamSelect}
          />
        </motion.div>
      </div>
    </div>
  );
};