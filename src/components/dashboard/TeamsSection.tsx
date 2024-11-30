import { TeamBox } from "./TeamBox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Team {
  name: string;
  participants: string[];
}

interface TeamsSectionProps {
  teams: Team[];
  onTeamAdd: () => void;
  onTeamUpdate: (index: number, team: Team) => void;
  onTeamRemove: (index: number) => void;
}

export const TeamsSection = ({
  teams,
  onTeamAdd,
  onTeamUpdate,
  onTeamRemove,
}: TeamsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Teams</h3>
        <Button onClick={onTeamAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Team
        </Button>
      </div>

      <div className="flex flex-row flex-nowrap overflow-x-auto gap-4 pb-4">
        <AnimatePresence>
          {teams.map((team, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-shrink-0"
            >
              <TeamBox
                index={index}
                team={team}
                onUpdate={onTeamUpdate}
                onRemove={onTeamRemove}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};