import { Card } from "./ui/card";

interface DraftOrderProps {
  participants: Array<{
    name: string;
    teams: Array<{
      teamNumber: number;
      teamName: string;
    }>;
  }>;
  currentIndex: number;
}

export const DraftOrder = ({ participants, currentIndex }: DraftOrderProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Draft Order</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {participants.map((participant, index) => (
          <div
            key={participant.name}
            className={`p-4 rounded-lg ${
              index === currentIndex
                ? 'bg-primary text-primary-foreground'
                : index === (currentIndex + 1) % participants.length
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{participant.name}</span>
                <span className="text-sm">
                  {index === currentIndex && '(Picking)'}
                  {index === (currentIndex + 1) % participants.length && '(Next)'}
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
          </div>
        ))}
      </div>
    </Card>
  );
};