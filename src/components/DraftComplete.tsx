import { Dialog, DialogContent } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import { useEffect, useState } from "react";
import { DraftStats } from "./DraftStats";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface DraftCompleteProps {
  draftId: string;
  eventName: string;
  participants: Array<{
    name: string;
    teams: Array<{
      teamNumber: number;
      teamName: string;
      stats?: {
        wins: number;
        losses: number;
        opr?: number;
        autoAvg?: number;
        ranking?: number;
      };
    }>;
  }>;
}

export const DraftComplete = ({ draftId, eventName, participants }: DraftCompleteProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const shootConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      };
      shootConfetti();
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < participants.length) {
          setCurrentParticipantIndex(index);
          index++;
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 }
          });
        } else {
          clearInterval(interval);
          setShowStats(true);
          setTimeout(shootConfetti, 300);
          setTimeout(shootConfetti, 600);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isOpen, participants.length]);

  const handleViewResults = () => {
    navigate(`/results/${draftId}`);
  };

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
              {eventName} Draft Complete!
            </motion.h2>
            
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {participants.map((participant, index) => (
                  <motion.div
                    key={participant.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={index <= currentParticipantIndex ? { 
                      opacity: 1, 
                      x: 0,
                      transition: { type: "spring", stiffness: 200, damping: 20 }
                    } : {}}
                    className={`p-4 rounded-lg mb-2 ${
                      index === currentParticipantIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <span className="text-lg font-semibold">
                      {index + 1}. {participant.name} - {participant.teams.length} teams
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {showStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-6"
              >
                <DraftStats participants={participants} />
                <div className="flex justify-center gap-4">
                  <Button onClick={() => navigate('/dashboard')}>
                    Return to Dashboard
                  </Button>
                  <Button onClick={handleViewResults} variant="default">
                    View Results
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};