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
  stats, 
  onSelect 
}: TeamCardProps) => {
  const logoUrl = `https://www.thebluealliance.com/team/${teamNumber}/avatar.png`;
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          onClick={onSelect}
          className="w-full p-4 h-auto flex items-center gap-4 hover:bg-accent hover:text-accent-foreground transition-colors group"
        >
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={logoUrl} alt={`Team ${teamNumber} logo`} />
            <AvatarFallback>{teamNumber}</AvatarFallback>
          </Avatar>
          <div className="text-left min-w-0">
            <div className="font-bold truncate">Team {teamNumber}</div>
            <div className="text-sm text-muted-foreground truncate group-hover:text-accent-foreground/80">{teamName}</div>
            <div className="text-sm truncate">Points: {districtPoints}</div>
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-background border">
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