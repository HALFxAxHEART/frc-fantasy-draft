import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion } from "framer-motion";

interface DraftOrderProps {
  participants: Array<{
    name: string;
    teams: Array<{
      teamNumber: number;
      teamName: string;
    }>;
  }>;
  currentIndex: number;
  round?: number;
}

export const DraftOrder = ({ participants, currentIndex, round = 1 }: DraftOrderProps) => {
  const isReverseRound = round % 2 === 0;
  
  const getDisplayOrder = () => {
    if (currentIndex === -1) {
      // Initial random order display with animation
      return participants.map((p, i) => ({ participant: p, index: i }));
    }
    
    // Calculate picking order based on snake draft pattern
    return participants.map((participant, originalIndex) => {
      let newIndex;
      if (isReverseRound) {
        newIndex = participants.length - 1 - originalIndex;
      } else {
        newIndex = originalIndex;
      }
      return { participant, index: newIndex };
    });
  };

  const displayOrder = getDisplayOrder();

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Draft Order</h3>
      <div className="grid grid-cols-1 gap-4">
        {displayOrder.map(({ participant }, displayIndex) => {
          const isPicking = isReverseRound 
            ? displayIndex === participants.length - 1 - currentIndex
            : displayIndex === currentIndex;
          const isNext = isReverseRound
            ? displayIndex === participants.length - 2 - currentIndex
            : displayIndex === currentIndex + 1;
          
          return (
            <motion.div
              key={participant.name}
              initial={currentIndex === -1 ? { scale: 0.9, opacity: 0 } : false}
              animate={{ 
                opacity: 1,
                scale: 1
              }}
              transition={{ 
                duration: 0.3,
                delay: currentIndex === -1 ? displayIndex * 0.2 : 0
              }}
              className={`p-4 rounded-lg ${
                isPicking
                  ? 'bg-red-500 text-white shadow-lg'
                  : isNext
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-muted'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`text-lg font-bold min-w-[24px] ${
                      currentIndex === -1 ? 'animate-pulse text-primary' : ''
                    }`}>
                      {displayIndex + 1}.
                    </span>
                    <Avatar className="h-12 w-12 border-2 border-background">
                      <AvatarFallback className="text-lg">
                        {participant.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-lg font-bold">{participant.name}</span>
                  </div>
                  <span className="text-sm">
                    {isPicking && '(Picking)'}
                    {isNext && '(Next)'}
                  </span>
                </div>
                {participant.teams.length > 0 && (
                  <div className="text-sm grid grid-cols-2 gap-2">
                    {participant.teams.map((team, idx) => (
                      <div key={idx} className="bg-background/10 p-2 rounded">
                        Team {team.teamNumber}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};