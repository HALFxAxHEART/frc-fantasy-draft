import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface DraftOrderAnimationProps {
  participants: Array<{ 
    name: string;
    teams: Array<{
      teamNumber: number;
      teamName: string;
    }>;
  }>;
  onComplete: () => void;
}

export const DraftOrderAnimation = ({ participants, onComplete }: DraftOrderAnimationProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Draft Order</h2>
        <AnimatePresence>
          {participants.map((participant, index) => (
            <motion.div
              key={participant.name}
              initial={{ x: -100, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: 1,
                transition: { delay: index * 0.3 }
              }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card p-4 rounded-lg shadow-lg border border-border"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">{index + 1}</span>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-foreground">{participant.name}</span>
                  <div className="text-sm text-muted-foreground">
                    {participant.teams.map((team, idx) => (
                      <span key={team.teamNumber} className="mr-2">
                        Team {team.teamNumber} - {team.teamName}
                        {idx < participant.teams.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: participants.length * 0.3 + 0.5 }
            }}
            className="mt-8"
          >
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
              onClick={onComplete}
            >
              Start Draft
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};