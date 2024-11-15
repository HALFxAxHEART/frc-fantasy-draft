import { Dialog, DialogContent } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface DraftOrderAnimationProps {
  participants: Array<{ name: string; teams: any[] }>;
  onComplete: () => void;
}

export const DraftOrderAnimation = ({ participants, onComplete }: DraftOrderAnimationProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < participants.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsOpen(false);
        onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, participants.length, onComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Draft Order</h2>
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <motion.div
                key={participant.name}
                initial={{ opacity: 0, y: 20 }}
                animate={index <= currentIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                className={`p-4 rounded-lg ${
                  index === currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                <span className="text-lg font-semibold">
                  {index + 1}. {participant.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};