import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface AddTeamCardProps {
  onAddTeam: () => void;
}

export const AddTeamCard = ({ onAddTeam }: AddTeamCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card 
        className="p-4 flex items-center justify-center h-full cursor-pointer hover:bg-accent transition-colors"
        onClick={onAddTeam}
      >
        <Button variant="ghost" size="icon">
          <Plus className="h-6 w-6" />
        </Button>
      </Card>
    </motion.div>
  );
};