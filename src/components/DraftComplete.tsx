import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <Dialog defaultOpen>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
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
              className="flex flex-col items-center gap-4"
            >
              <Trophy className="w-20 h-20 text-primary" />
              <h2 className="text-4xl font-bold">Draft Complete!</h2>
            </motion.div>
          </DialogTitle>
        </DialogHeader>
        
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
                    className="bg-card p-3 rounded text-sm border border-border"
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
          className="mt-8 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          Return to Dashboard
        </Button>
      </DialogContent>
    </Dialog>
  );
};