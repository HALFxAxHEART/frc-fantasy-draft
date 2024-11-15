import { Dialog, DialogContent } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface DraftOrderAnimationProps {
  participants: Array<{ name: string; teams: any[] }>;
  onComplete: () => void;
}

export const DraftOrderAnimation = ({ participants, onComplete }: DraftOrderAnimationProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showStartButton, setShowStartButton] = useState(false);

  useEffect(() => {
    if (currentIndex < participants.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (currentIndex === participants.length - 1) {
      const timer = setTimeout(() => {
        setShowStartButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, participants.length]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Draft Order</h2>
          <div className="space-y-4">
            <AnimatePresence>
              {participants.map((participant, index) => (
                <motion.div
                  key={participant.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={index <= currentIndex ? { 
                    opacity: 1, 
                    x: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 200, damping: 20 }
                  } : {}}
                  className={`p-4 rounded-lg ${
                    index === currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <span className="text-lg font-semibold">
                    {index + 1}. {participant.name}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {showStartButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Button 
                onClick={onComplete}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Draft
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};