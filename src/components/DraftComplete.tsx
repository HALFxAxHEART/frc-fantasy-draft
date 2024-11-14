import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from 'canvas-confetti';

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

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center"
    >
      <div className="max-w-4xl w-full mx-auto p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 p-8 rounded-lg shadow-xl border border-primary/20 text-center space-y-6"
        >
          <Trophy className="w-20 h-20 mx-auto text-primary animate-pulse" />
          <h2 className="text-4xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-pulse">
            Draft Complete!
          </h2>
          <div className="grid grid-cols-2 gap-6 mt-8">
            {participants.map((participant) => (
              <motion.div
                key={participant.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-3"
              >
                <h3 className="font-semibold text-xl text-primary">{participant.name}</h3>
                <div className="space-y-2">
                  {participant.teams.map((team) => (
                    <div
                      key={team.teamNumber}
                      className="bg-background/40 p-3 rounded text-sm backdrop-blur-sm border border-primary/10"
                    >
                      Team {team.teamNumber} - {team.teamName}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            className="mt-8 bg-primary hover:bg-primary/90"
            size="lg"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};