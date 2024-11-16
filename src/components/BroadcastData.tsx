import { Card } from "./ui/card";
import { motion } from "framer-motion";

interface BroadcastDataProps {
  eventName: string;
  participants: Array<{
    name: string;
    teams: Array<{
      teamNumber: number;
      teamName: string;
    }>;
  }>;
}

export const BroadcastData = ({ eventName, participants }: BroadcastDataProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-foreground">{eventName} Draft Results</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {participants.map((participant) => (
            <div
              key={participant.name}
              className="bg-background/60 p-4 rounded-lg border border-border"
            >
              <h3 className="font-semibold mb-2 text-foreground">{participant.name}</h3>
              <div className="space-y-1">
                {participant.teams.map((team) => (
                  <div key={team.teamNumber} className="text-sm text-muted-foreground">
                    {team.teamNumber} - {team.teamName}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Card>
  );
};