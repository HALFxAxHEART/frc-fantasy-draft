import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface DraftCreationProps {
  participants: number;
  participantNames: string[];
  onParticipantsChange: (value: number) => void;
  onParticipantNameChange: (index: number, value: string) => void;
  onStartDraft: () => void;
}

export const DraftCreation = ({
  participants,
  participantNames,
  onParticipantsChange,
  onParticipantNameChange,
  onStartDraft,
}: DraftCreationProps) => {
  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Create New Draft</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Participants
          </label>
          <Input
            type="number"
            min="2"
            max="10"
            value={participants}
            onChange={(e) => onParticipantsChange(Number(e.target.value))}
            className="w-full max-w-xs"
          />
        </div>

        {/* Participant Names */}
        {Array.from({ length: participants }).map((_, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1">
              Participant {index + 1} Name
            </label>
            <Input
              type="text"
              value={participantNames[index] || ''}
              onChange={(e) => onParticipantNameChange(index, e.target.value)}
              className="w-full max-w-xs"
              placeholder={`Enter name for participant ${index + 1}`}
            />
          </div>
        ))}

        <Button 
          onClick={onStartDraft}
          className="mt-4"
        >
          Start Draft
        </Button>
      </div>
    </Card>
  );
};