import { useState, useEffect } from "react";
import { Card } from "./ui/card";

interface DraftTimerProps {
  initialTime: number;
  onTimeUp: () => void;
}

export const DraftTimer = ({ initialTime, onTimeUp }: DraftTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [hasTriggeredTimeUp, setHasTriggeredTimeUp] = useState(false);

  useEffect(() => {
    setTimeRemaining(initialTime);
    setHasTriggeredTimeUp(false);
  }, [initialTime]);

  useEffect(() => {
    if (timeRemaining === 0 && !hasTriggeredTimeUp) {
      setHasTriggeredTimeUp(true);
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp, hasTriggeredTimeUp]);

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