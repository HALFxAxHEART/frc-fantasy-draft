import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DraftCompleteProps {
  participants: Array<{
    name: string;
    teams: Array<{
      teamNumber: number;
      teamName: string;
    }>;
  }>;
}

export const DraftComplete = ({ participants }: DraftCompleteProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="max-w-2xl w-full mx-auto p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-8 rounded-lg shadow-lg border border-border text-center space-y-6"
        >
          <Trophy className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Draft Complete!</h2>
          <div className="grid grid-cols-2 gap-6 mt-8">
            {participants.map((participant) => (
              <div key={participant.name} className="space-y-3">
                <h3 className="font-semibold text-lg">{participant.name}</h3>
                <div className="space-y-2">
                  {participant.teams.map((team) => (
                    <div
                      key={team.teamNumber}
                      className="bg-muted p-2 rounded text-sm"
                    >
                      Team {team.teamNumber} - {team.teamName}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            className="mt-8"
            size="lg"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};