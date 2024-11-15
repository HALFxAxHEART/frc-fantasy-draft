import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import confetti from 'canvas-confetti';
import { useEffect } from "react";

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
  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-center mb-8 text-foreground"
        >
          Draft Order
        </motion.h2>
        <AnimatePresence>
          {participants.map((participant, index) => (
            <motion.div
              key={participant.name}
              initial={{ x: -100, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: 1,
                transition: { 
                  delay: index * 0.5,
                  type: "spring",
                  stiffness: 100
                }
              }}
              exit={{ x: 100, opacity: 0 }}
              className="bg-card p-4 rounded-lg shadow-lg border border-border"
            >
              <div className="flex items-center gap-4">
                <motion.span 
                  className="text-4xl font-bold text-primary"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.5 + 0.25
                  }}
                >
                  {index + 1}
                </motion.span>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-foreground">{participant.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: participants.length * 0.5 + 0.5 }
            }}
            className="mt-8"
          >
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
              onClick={() => {
                confetti({
                  particleCount: 50,
                  spread: 70,
                  origin: { y: 0.6 }
                });
                onComplete();
              }}
            >
              Start Draft
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};