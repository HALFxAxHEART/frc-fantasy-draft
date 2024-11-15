import { useState, useEffect } from "react";
import { Card } from "./ui/card";

interface DraftTimerProps {
  onTimeUp: () => void;
  isActive: boolean;
}

export const DraftTimer = ({ onTimeUp, isActive }: DraftTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasTriggeredTimeUp, setHasTriggeredTimeUp] = useState(false);

  useEffect(() => {
    // Get the draft time limit from settings
    const draftSettings = localStorage.getItem("draftSettings");
    const settings = draftSettings ? JSON.parse(draftSettings) : { draftTimeLimit: 120 };
    setTimeRemaining(settings.draftTimeLimit);
    setHasTriggeredTimeUp(false);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    if (timeRemaining === 0 && !hasTriggeredTimeUp) {
      setHasTriggeredTimeUp(true);
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp, hasTriggeredTimeUp, isActive]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <Card className={`p-4 text-center ${timeRemaining <= 30 ? 'animate-pulse bg-red-500/20' : ''}`}>
      <h3 className="text-3xl font-bold">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </h3>
    </Card>
  );
};