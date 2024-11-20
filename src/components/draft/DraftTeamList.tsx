import { Card } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamCard } from "../TeamCard";
import { motion, AnimatePresence } from "framer-motion";
import { useDraftState } from "./DraftStateProvider";
import { Input } from "../ui/input";
import { useState } from "react";
import { DraftParticipant, Team } from "@/types/draft";

interface DraftTeamListProps {
  draftId: string;
  availableTeams: Team[];
  currentParticipant: string;
  onTeamSelect: (team: Team) => void;
  hidePoints?: boolean;
}

export const DraftTeamList = ({
  draftId,
  availableTeams,
  currentParticipant,
  onTeamSelect,
  hidePoints = false,
}: DraftTeamListProps) => {
  const { toast } = useToast();
  const { draftState } = useDraftState();
  const [searchQuery, setSearchQuery] = useState("");
  const [minWinRate, setMinWinRate] = useState(0);

  const handleTeamSelect = async (team: Team) => {
    try {
      const { data: draft, error } = await supabase
        .from('drafts')
        .select('participants, draft_data')
        .eq('id', draftId)
        .single();

      if (error) throw error;
      if (!draft) {
        throw new Error('Draft not found');
      }

      // Type assertion with unknown as intermediate step
      const participants = (draft.participants as unknown) as DraftParticipant[];
      const currentParticipantData = participants.find(p => p.name === currentParticipant);
      
      if (!currentParticipantData) {
        throw new Error('Current participant not found');
      }

      if (currentParticipantData.teams?.length >= 5) {
        toast({
          title: "Maximum Teams Reached",
          description: "You can only select up to 5 teams per participant.",
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

  const filteredTeams = availableTeams.filter(team => {
    const isNotDrafted = !draftState.participants.some(p => 
      p.teams.some(t => t.teamNumber === team.teamNumber)
    );
    
    const matchesSearch = team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.teamNumber.toString().includes(searchQuery);
    
    const winRate = team.stats?.wins ? (team.stats.wins / (team.stats.wins + (team.stats.losses || 0)) * 100) : 0;
    const meetsWinRate = winRate >= minWinRate;

    return isNotDrafted && matchesSearch && meetsWinRate;
  });

  return (
    <Card className="p-6">
      <div className="mb-6 space-y-4">
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm">Min Win Rate:</span>
          <Input
            type="number"
            min="0"
            max="100"
            value={minWinRate}
            onChange={(e) => setMinWinRate(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm">%</span>
        </div>
      </div>

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
                districtPoints={0} // Add default district points
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