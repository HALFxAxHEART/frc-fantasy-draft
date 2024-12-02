import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion } from "framer-motion";
import { Team } from "@/types/draft";

interface DraftTeam {
  name: string;
  participants: string[];
  selectedTeams: Team[];
}

interface DraftOrderProps {
  teams: DraftTeam[];
  currentIndex: number;
  round?: number;
}

export const DraftOrder = ({ teams, currentIndex, round = 1 }: DraftOrderProps) => {
  const isReverseRound = round % 2 === 0;
  
  const getPickingStatus = (displayIndex: number) => {
    const effectiveIndex = isReverseRound 
      ? teams.length - 1 - currentIndex
      : currentIndex;
    
    const nextIndex = isReverseRound
      ? effectiveIndex - 1
      : effectiveIndex + 1;

    return {
      isPicking: displayIndex === effectiveIndex,
      isNext: displayIndex === nextIndex
    };
  };

  // Check if teams array exists and has valid team objects
  const hasValidTeams = teams?.length > 0;

  if (!hasValidTeams) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">No participants added yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4 text-foreground">Draft Order</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team, displayIndex) => {
          const { isPicking, isNext } = getPickingStatus(displayIndex);
          
          return (
            <motion.div
              key={team.name || displayIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg ${
                isPicking
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : isNext
                  ? 'bg-muted/50 text-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold min-w-[24px]">
                    {displayIndex + 1}.
                  </span>
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarFallback className="text-lg">
                      {team.name?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">{team.name}</span>
                    {team.participants && team.participants.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {team.participants.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm">
                  {isPicking && <span className="font-medium">(Picking)</span>}
                  {isNext && <span className="font-medium">(Next)</span>}
                </div>
                {team.selectedTeams && team.selectedTeams.length > 0 && (
                  <div className="text-sm mt-2">
                    <div className="font-medium mb-1">Selected Teams:</div>
                    <div className="grid grid-cols-1 gap-1">
                      {team.selectedTeams.map((selectedTeam, idx) => (
                        <div 
                          key={idx} 
                          className="bg-background/10 p-2 rounded flex items-center justify-between"
                        >
                          <span>{selectedTeam.teamName}</span>
                          <span className="text-xs opacity-75">#{selectedTeam.teamNumber}</span>
                        </div>
                      ))}
                    </div>
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