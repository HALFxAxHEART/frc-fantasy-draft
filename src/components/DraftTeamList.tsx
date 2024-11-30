import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamCard } from "@/components/TeamCard";
import { motion, AnimatePresence } from "framer-motion";
import { useDraftState } from "./DraftStateProvider";
import { Json } from "@/integrations/supabase/types";
import { Team } from "@/types/draft";

interface DraftTeamListProps {
  draftId: string;
  availableTeams: Team[];
  currentParticipant: string;
  onTeamSelect: (team: Team) => void;
  maxTeams?: number;
  hidePoints?: boolean;
}

export const DraftTeamList = ({
  draftId,
  availableTeams,
  currentParticipant,
  onTeamSelect,
  maxTeams = 5,
  hidePoints = false,
}: DraftTeamListProps) => {
  const { toast } = useToast();
  const { draftState } = useDraftState();

  const handleTeamSelect = async (team: Team) => {
    try {
      const { data: draft } = await supabase
        .from('drafts')
        .select('participants')
        .eq('id', draftId)
        .single();

      if (!draft) {
        throw new Error('Draft not found');
      }

      const participants = draft.participants as Array<{
        name: string;
        teams: Team[];
      }>;

      const currentParticipantData = participants.find(p => p.name === currentParticipant);
      if (!currentParticipantData) {
        throw new Error('Current participant not found');
      }

      if (currentParticipantData.teams?.length >= maxTeams) {
        toast({
          title: "Maximum Teams Reached",
          description: `You can only select up to ${maxTeams} teams per participant.`,
          variant: "destructive",
        });
        return;
      }

      onTeamSelect(team);
      
      toast({
        title: "Team Selected!",
        description: `${team.teamName} has been drafted by ${currentParticipant}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredTeams = availableTeams.filter(team => 
    !draftState.participants.some(p => 
      p.teams.some(t => t.teamNumber === team.teamNumber)
    )
  );

  return (
    <Card className="p-6">
      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredTeams.map((team) => (
            <motion.div
              key={team.teamNumber}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <TeamCard
                {...team}
                hidePoints={hidePoints}
                onSelect={() => handleTeamSelect(team)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};