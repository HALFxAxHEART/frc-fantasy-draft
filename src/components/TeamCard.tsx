import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface TeamStats {
  wins: number;
  losses: number;
  opr: number;
  autoAvg: number;
}

interface TeamCardProps {
  teamNumber: number;
  teamName: string;
  districtPoints: number;
  logoUrl?: string;
  stats: TeamStats;
  onSelect: () => void;
}

export const TeamCard = ({ 
  teamNumber, 
  teamName, 
  districtPoints, 
  logoUrl, 
  stats, 
  onSelect 
}: TeamCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          onClick={onSelect}
          className="w-full p-4 h-auto flex items-center gap-4 hover:bg-secondary/90 transition-colors"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={logoUrl} alt={`Team ${teamNumber} logo`} />
            <AvatarFallback>{teamNumber}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <div className="font-bold">Team {teamNumber}</div>
            <div className="text-sm text-muted-foreground">{teamName}</div>
            <div className="text-sm">Points: {districtPoints}</div>
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Team Statistics</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Win/Loss: {stats.wins}/{stats.losses}</div>
            <div>OPR: {stats.opr.toFixed(2)}</div>
            <div>Auto Avg: {stats.autoAvg.toFixed(2)}</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};