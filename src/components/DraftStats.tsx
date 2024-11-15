import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";
import { DraftParticipant } from "@/types/draft";

interface DraftStatsProps {
  participants: DraftParticipant[];
}

export const DraftStats = ({ participants }: DraftStatsProps) => {
  const calculateScore = (participant: DraftParticipant) => {
    return participant.teams.reduce((acc, team) => {
      if (team.stats?.wins !== undefined && team.stats?.losses !== undefined) {
        const totalGames = team.stats.wins + team.stats.losses;
        return acc + (totalGames > 0 ? (team.stats.wins / totalGames) * 100 : 0);
      }
      return acc;
    }, 0) / (participant.teams.length || 1);
  };

  const sortedParticipants = [...participants].sort(
    (a, b) => calculateScore(b) - calculateScore(a)
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
                {calculateScore(participant).toFixed(1)}% Win Rate
              </span>
            </div>
            <Progress value={calculateScore(participant)} className="h-2" />
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