import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { DraftOrderAnimation } from "./DraftOrderAnimation";

interface DraftSetupProps {
  participants: Array<{ name: string; teams: any[] }>;
  onStartDraft: () => void;
}

export const DraftSetup = ({ participants, onStartDraft }: DraftSetupProps) => {
  const [showAnimation, setShowAnimation] = useState(true); // Show animation immediately
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setAnimationComplete(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {animationComplete && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Draft Order</h2>
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div
                key={participant.name}
                className="flex items-center space-x-4 p-4 bg-muted rounded-lg"
              >
                <span className="text-2xl font-bold text-primary">{index + 1}</span>
                <span className="font-medium text-foreground">{participant.name}</span>
                <div className="text-sm text-muted-foreground">
                  {participant.teams.map((team, idx) => (
                    <span key={team.teamNumber} className="mr-2">
                      Team {team.teamNumber} - {team.teamName}
                      {idx < participant.teams.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
            size="lg"
            onClick={onStartDraft}
          >
            Start Draft
          </Button>
        </Card>
      )}

      {showAnimation && (
        <DraftOrderAnimation 
          participants={participants}
          onComplete={handleAnimationComplete}
        />
      )}
    </motion.div>
  );
};