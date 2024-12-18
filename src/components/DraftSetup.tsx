import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { DraftOrder } from "./DraftOrder";

interface DraftSetupProps {
  teams: Array<{
    name: string;
    participants: string[];
    selectedTeams: any[];
  }>;
  onStartDraft: () => void;
}

export const DraftSetup = ({ teams, onStartDraft }: DraftSetupProps) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showStartButton, setShowStartButton] = useState(false);

  // Start the animation sequence when component mounts
  useState(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < teams.length) {
        setCurrentIndex(index);
        index++;
      } else {
        clearInterval(interval);
        setShowStartButton(true);
      }
    }, 800);

    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <DraftOrder
                teams={teams}
                currentIndex={currentIndex}
              />
            </div>
            <div className="flex items-center justify-center">
              <AnimatePresence>
                {showStartButton && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full"
                  >
                    <Button
                      onClick={onStartDraft}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                    >
                      Start Draft
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};