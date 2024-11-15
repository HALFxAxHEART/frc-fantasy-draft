import { Dialog, DialogContent } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import { useEffect, useState } from "react";
import { DraftStats } from "./DraftStats";

interface DraftCompleteProps {
  participants: Array<{
    name: string;
    teams: Array<{
      teamNumber: number;
      teamName: string;
      stats?: {
        wins: number;
        losses: number;
        ranking: number;
      };
    }>;
  }>;
}

export const DraftComplete = ({ participants }: DraftCompleteProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const shootConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      };

      // Shoot confetti multiple times for a more dramatic effect
      shootConfetti();
      setTimeout(shootConfetti, 300);
      setTimeout(shootConfetti, 600);
      
      // Show stats after a brief delay
      setTimeout(() => setShowStats(true), 1000);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
          >
            <motion.h2 
              className="text-3xl font-bold text-center mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              Congratulations! Draft Complete!
            </motion.h2>
            
            <motion.p 
              className="text-center text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Here's how everyone did in the draft:
            </motion.p>

            {showStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <DraftStats participants={participants} />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};