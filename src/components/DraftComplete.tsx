import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/90 backdrop-blur-lg z-50 flex items-center justify-center"
      >
        <div className="max-w-4xl w-full mx-auto p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 p-8 rounded-lg shadow-xl border border-border text-center space-y-6"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Trophy className="w-20 h-20 mx-auto text-primary" />
            </motion.div>
            
            <h2 className="text-4xl font-bold text-foreground">
              Draft Complete!
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              {participants.map((participant, index) => (
                <motion.div
                  key={participant.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="space-y-3"
                >
                  <h3 className="font-semibold text-xl text-primary">{participant.name}</h3>
                  <div className="space-y-2">
                    {participant.teams.map((team, teamIndex) => (
                      <motion.div
                        key={team.teamNumber}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (index * 0.2) + (teamIndex * 0.1) }}
                        className="bg-card p-3 rounded text-sm text-card-foreground border border-border"
                      >
                        Team {team.teamNumber} - {team.teamName}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <Button
              onClick={() => navigate("/dashboard")}
              className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Return to Dashboard
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};