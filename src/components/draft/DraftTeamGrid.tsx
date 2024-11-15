import { Team } from "@/types/draft";
import { TeamCard } from "../TeamCard";
import { Card } from "../ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface DraftTeamGridProps {
  teams?: Team[];
  isLoading: boolean;
  onTeamSelect: (team: Team) => void;
  hidePoints?: boolean;
}

export const DraftTeamGrid = ({ teams, isLoading, onTeamSelect, hidePoints = false }: DraftTeamGridProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
        <p className="text-lg text-muted-foreground">Loading teams...</p>
      </Card>
    );
  }

  if (!teams?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg text-muted-foreground">No teams available for this event yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {teams.map((team) => (
            <motion.div
              key={team.teamNumber}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <TeamCard
                {...team}
                hidePoints={hidePoints}
                onSelect={() => onTeamSelect(team)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};