import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Team } from "@/types/draft";

interface TeamCardProps extends Omit<Team, 'stats'> {
  stats?: {
    wins: number;
    losses: number;
    opr?: number;
    autoAvg?: number;
    ranking?: number;
  };
  onSelect: () => void;
  hidePoints?: boolean;
}

export const TeamCard = ({ 
  teamNumber, 
  teamName, 
  districtPoints, 
  stats = { wins: 0, losses: 0 }, 
  onSelect,
  hidePoints = false
}: TeamCardProps) => {
  const logoUrl = `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/media/avatar`;
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          onClick={onSelect}
          className="w-full h-36 p-3 flex flex-col items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors group"
        >
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={logoUrl} alt={`Team ${teamNumber} logo`} />
            <AvatarFallback>{teamNumber}</AvatarFallback>
          </Avatar>
          <div className="text-center min-w-0 flex-1 flex flex-col justify-center">
            <div className="font-bold">Team {teamNumber}</div>
            <div className="text-sm text-muted-foreground group-hover:text-accent-foreground/80 line-clamp-2">{teamName}</div>
            {!hidePoints && <div className="text-sm">Points: {districtPoints}</div>}
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-background border">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Team Statistics</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Win/Loss: {stats.wins}/{stats.losses}</div>
            {stats.opr !== undefined && <div>OPR: {stats.opr.toFixed(2)}</div>}
            {stats.autoAvg !== undefined && <div>Auto Avg: {stats.autoAvg.toFixed(2)}</div>}
            {stats.ranking && <div>Rank: {stats.ranking}</div>}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};