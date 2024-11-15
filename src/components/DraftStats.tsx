import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";
import { Team } from "@/types/draft";

interface DraftStatsProps {
  participants: Array<{
    name: string;
    teams: Team[];
  }>;
}

export const DraftStats = ({ participants }: DraftStatsProps) => {
  const calculateScore = (teams: Team[]) => {
    return teams.reduce((acc, team) => {
      if (team.stats?.wins !== undefined && team.stats?.losses !== undefined) {
        return acc + (team.stats.wins / (team.stats.wins + team.stats.losses)) * 100;
      }
      return acc;
    }, 0) / teams.length;
  };

  const sortedParticipants = [...participants].sort(
    (a, b) => calculateScore(b.teams) - calculateScore(a.teams)
  );

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Draft Standings</h2>
      <div className="space-y-6">
        {sortedParticipants.map((participant, index) => (
          <motion.div
            key={participant.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{index + 1}.</span>
                <span className="text-lg">{participant.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {calculateScore(participant.teams).toFixed(1)}% Win Rate
              </span>
            </div>
            <Progress value={calculateScore(participant.teams)} className="h-2" />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {participant.teams.map((team) => (
                <div
                  key={team.teamNumber}
                  className="text-sm bg-muted p-2 rounded flex justify-between items-center"
                >
                  <span>Team {team.teamNumber}</span>
                  {team.stats?.ranking && (
                    <span className="text-xs text-muted-foreground">
                      Rank: {team.stats.ranking}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};