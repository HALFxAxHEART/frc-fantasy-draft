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

        <div className="space-y-4">
          {participantNames.map((name, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">
                Participant {index + 1} Name
              </label>
              <Input
                value={name}
                onChange={(e) => onParticipantNameChange(index, e.target.value)}
                className="w-full max-w-xs"
              />
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
          onClick={onStartDraft}
        >
          Start Draft
        </Button>
      </div>
    </Card>
  );
};