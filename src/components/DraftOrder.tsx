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
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Draft Order</h3>
      <div className="space-y-2">
        {participants.map((participant, index) => (
          <div
            key={participant.name}
            className={`p-3 rounded-lg ${
              index === currentIndex
                ? 'bg-primary text-primary-foreground'
                : index === (currentIndex + 1) % participants.length
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{participant.name}</span>
                {index === currentIndex && ' (Picking)'}
                {index === (currentIndex + 1) % participants.length && ' (Next)'}
              </div>
              <div className="text-sm">
                {participant.teams.length > 0 && (
                  <span>Teams: {participant.teams.map(team => team.teamNumber).join(', ')}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};