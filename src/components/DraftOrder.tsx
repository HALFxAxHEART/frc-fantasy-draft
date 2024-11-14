import { Card } from "./ui/card";

interface DraftOrderProps {
  participants: Array<{
    name: string;
    teams: any[];
  }>;
  currentIndex: number;
}

export const DraftOrder = ({ participants, currentIndex }: DraftOrderProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Draft Order</h3>
      <div className="flex flex-wrap gap-2">
        {participants.map((participant, index) => (
          <div
            key={participant.name}
            className={`px-3 py-1 rounded-full text-sm ${
              index === currentIndex
                ? 'bg-primary text-primary-foreground'
                : index === (currentIndex + 1) % participants.length
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted'
            }`}
          >
            {participant.name}
            {index === currentIndex && ' (Picking)'}
            {index === (currentIndex + 1) % participants.length && ' (Next)'}
          </div>
        ))}
      </div>
    </Card>
  );
};