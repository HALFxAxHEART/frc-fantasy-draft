import { useState, useEffect } from "react";
import { Card } from "./ui/card";

interface DraftTimerProps {
  onTimeUp: () => void;
  isActive: boolean;
  autoSelectTeam: () => void;
}

export const DraftTimer = ({ onTimeUp, isActive, autoSelectTeam }: DraftTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes default
  const [hasTriggeredTimeUp, setHasTriggeredTimeUp] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1 && !hasTriggeredTimeUp) {
          clearInterval(timer);
          setHasTriggeredTimeUp(true);
          onTimeUp();
          autoSelectTeam(); // Auto select team when timer hits 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp, hasTriggeredTimeUp, autoSelectTeam]);

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