import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DraftTimer } from "@/components/DraftTimer";
import { TeamCard } from "@/components/TeamCard";
import { DraftOrder } from "@/components/DraftOrder";
import { DraftSetup } from "@/components/DraftSetup";
import { DraftComplete } from "@/components/DraftComplete";
import { DraftStateProvider, useDraftState } from "@/components/draft/DraftStateProvider";
import { DraftControls } from "@/components/draft/DraftControls";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DraftParticipant {
  name: string;
  teams: Array<{
    teamNumber: number;
    teamName: string;
  }>;
}

interface DraftData {
  id: string;
  event_key: string;
  event_name: string;
  status: string;
  participants: DraftParticipant[];
  draft_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const DraftContent = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [availableTeams, setAvailableTeams] = useState([]);
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

      // Ensure participants data is properly typed
      const typedData: DraftData = {
        ...data,
        participants: (data.participants as any[] || []).map((participant: any) => ({
          name: participant.name,
          teams: Array.isArray(participant.teams) ? participant.teams.map((team: any) => ({
            teamNumber: team.teamNumber,
            teamName: team.teamName
          })) : []
        }))
      };
      
      return typedData;
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
        setAvailableTeams(
          teams.map((team: any) => ({
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
  }, [draftData?.event_key]);

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
                    currentIndex={0}
                  />
                </div>
                <div>
                  <DraftTimer
                    initialTime={120}
                    onTimeUp={() => {}}
                    isActive={isTimerActive}
                  />
                </div>
              </div>

              <Card className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableTeams.map((team: any) => (
                    <TeamCard
                      key={team.teamNumber}
                      {...team}
                      onSelect={() => {}}
                    />
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <div>
              <h1 className="text-3xl font-bold mb-8">Create New Draft</h1>
              <Card className="p-6">
                <p>Please use the dashboard to create a new draft.</p>
              </Card>
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