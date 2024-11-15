import { useState } from "react";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { DraftOrderAnimation } from "./DraftOrderAnimation";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

interface DraftSetupProps {
  participants: Array<{ name: string; teams: any[] }>;
  onStartDraft: () => void;
}

export const DraftSetup = ({ participants, onStartDraft }: DraftSetupProps) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <Dialog open={showAnimation} onOpenChange={setShowAnimation}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {showAnimation && !animationComplete && (
            <DraftOrderAnimation 
              participants={participants}
              onComplete={handleAnimationComplete}
            />
          )}
          
          {animationComplete && (
            <div className="flex flex-col items-center space-y-4 p-4">
              <h2 className="text-2xl font-bold text-center">Draft Order Set!</h2>
              <p className="text-center text-muted-foreground">
                Are you ready to begin the draft?
              </p>
              <Button
                onClick={() => {
                  setShowAnimation(false);
                  onStartDraft();
                }}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Start Draft
              </Button>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};