import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DraftTimer } from "@/components/DraftTimer";
import { DraftOrder } from "@/components/DraftOrder";
import { DraftTeamList } from "@/components/draft/DraftTeamList";
import { DraftStateProvider, useDraftState } from "@/components/draft/DraftStateProvider";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

interface DraftParticipant {
  name: string;
  teams: Team[];
}

interface DraftData {
  id: string;
  event_key: string;
  event_name: string;
  status: string | null;
  participants: DraftParticipant[];
  draft_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

const DraftContent = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

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
      return data as DraftData;
    },
    enabled: !!draftId,
  });

  useEffect(() => {
    const fetchTeams = async () => {
      if (!draftData?.event_key) return;
      
      try {
        const response = await fetch(
          `https://www.thebluealliance.com/api/v3/event/${draftData.event_key}/teams`,
          {
            headers: {
              "X-TBA-Auth-Key": import.meta.env.VITE_TBA_API_KEY,
            },
          }
        );
        const teams = await response.json();
        const selectedTeams = draftData.draft_data?.selectedTeams || [];
        
        setAvailableTeams(
          teams
            .filter((team: any) => !selectedTeams.includes(team.team_number))
            .map((team: any) => ({
              teamNumber: team.team_number,
              teamName: team.nickname,
              districtPoints: Math.floor(Math.random() * 100),
              stats: {
                wins: Math.floor(Math.random() * 10),
                losses: Math.floor(Math.random() * 10),
                opr: Math.random() * 50,
                autoAvg: Math.random() * 15,
              },
            }))
        );
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch teams for this event",
          variant: "destructive",
        });
      }
    };
    fetchTeams();
  }, [draftData?.event_key, draftData?.draft_data?.selectedTeams]);

  const handleTimeUp = () => {
    const draftSettings = localStorage.getItem("draftSettings");
    const settings = draftSettings ? JSON.parse(draftSettings) : { autoAdvancePicks: false };
    
    if (settings.autoAdvancePicks) {
      setCurrentParticipantIndex((prev) => 
        (prev + 1) % (draftData?.participants.length || 1)
      );
    }
  };

  const handleTeamSelect = (team: Team) => {
    setAvailableTeams((prev) => 
      prev.filter((t) => t.teamNumber !== team.teamNumber)
    );
    setCurrentParticipantIndex((prev) => 
      (prev + 1) % (draftData?.participants.length || 1)
    );
  };

  if (isLoading) {
    return <div>Loading draft...</div>;
  }

  if (!draftData && draftId) {
    return <div>Draft not found</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {draftData ? (
            <>
              <h1 className="text-3xl font-bold">{draftData.event_name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <DraftOrder
                    participants={draftData.participants}
                    currentIndex={currentParticipantIndex}
                  />
                </div>
                <div>
                  <DraftTimer
                    onTimeUp={handleTimeUp}
                    isActive={isTimerActive}
                  />
                </div>
              </div>

              <DraftTeamList
                draftId={draftId}
                availableTeams={availableTeams}
                currentParticipant={draftData.participants[currentParticipantIndex].name}
                onTeamSelect={handleTeamSelect}
              />
            </>
          ) : (
            <div>
              <h1 className="text-3xl font-bold mb-8">Create New Draft</h1>
              <p>Please use the dashboard to create a new draft.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const Draft = () => {
  return (
    <DraftStateProvider>
      <DraftContent />
    </DraftStateProvider>
  );
};

export default Draft;