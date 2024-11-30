import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamCard } from "./TeamCard";
import { motion, AnimatePresence } from "framer-motion";
import { useDraftState } from "./DraftStateProvider";
import { Team } from "@/types/draft";

interface DraftTeamListProps {
  draftId: string;
  availableTeams: Team[];
  currentTeam: string;
  onTeamSelect: (team: Team) => void;
  hidePoints?: boolean;
}

export const DraftTeamList = ({
  draftId,
  availableTeams,
  currentTeam,
  onTeamSelect,
  hidePoints = false,
}: DraftTeamListProps) => {
  const { toast } = useToast();
  const { draftState } = useDraftState();

  const handleTeamSelect = async (team: Team) => {
    try {
      const { data: draft } = await supabase
        .from('drafts')
        .select('teams')
        .eq('id', draftId)
        .single();

      if (!draft) {
        throw new Error('Draft not found');
      }

      const currentTeamData = draftState.teams[draftState.currentTeamIndex];
      if (!currentTeamData) {
        throw new Error('Current team not found');
      }

      if (currentTeamData.selectedTeams?.length >= draftState.maxTeamsPerTeam) {
        toast({
          title: "Maximum Teams Reached",
          description: "You can only select up to 5 teams per team.",
          variant: "destructive",
        });
        return;
      }

      onTeamSelect(team);
      
      toast({
        title: "Team Selected!",
        description: `${team.teamName} has been drafted by ${currentTeam}`,
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
    !draftState.teams.some(draftTeam => 
      draftTeam.selectedTeams?.some(selectedTeam => selectedTeam.teamNumber === team.teamNumber)
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