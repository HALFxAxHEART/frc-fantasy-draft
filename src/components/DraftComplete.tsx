import { Dialog, DialogContent } from "./ui/dialog";
import { motion } from "framer-motion";
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

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Draft Complete!</h2>
          <DraftStats participants={participants} />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};