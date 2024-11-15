import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion } from "framer-motion";
import { Team } from "@/types/draft";

interface DraftOrderProps {
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
      };
    }>;
  }>;
  currentIndex: number;
  round?: number;
}

export const DraftOrder = ({ participants, currentIndex, round = 1 }: DraftOrderProps) => {
  const isReverseRound = round % 2 === 0;
  
  const getPickingStatus = (displayIndex: number) => {
    const effectiveIndex = isReverseRound 
      ? participants.length - 1 - currentIndex
      : currentIndex;
    
    const nextIndex = isReverseRound
      ? effectiveIndex - 1
      : effectiveIndex + 1;

    return {
      isPicking: displayIndex === effectiveIndex,
      isNext: displayIndex === nextIndex && nextIndex >= 0 && nextIndex < participants.length
    };
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Draft Order</h3>
      <div className="flex flex-col space-y-4">
        {participants.map((participant, displayIndex) => {
          const { isPicking, isNext } = getPickingStatus(displayIndex);
          
          return (
            <motion.div
              key={participant.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg ${
                isPicking
                  ? 'bg-red-500 text-white shadow-lg'
                  : isNext
                  ? 'bg-green-500/20 text-gray-800'
                  : 'bg-muted'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold min-w-[24px]">
                      {displayIndex + 1}.
                    </span>
                    <Avatar className="h-12 w-12 border-2 border-background">
                      <AvatarFallback className="text-lg">
                        {participant.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-lg font-bold">{participant.name}</span>
                  </div>
                  <span className={`text-sm font-semibold ${isPicking ? 'text-white' : isNext ? 'text-green-700' : ''}`}>
                    {isPicking && '🎯 Currently Picking'}
                    {isNext && '⏳ Up Next'}
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