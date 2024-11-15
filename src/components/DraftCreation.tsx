import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface DraftCreationProps {
  participants: number;
  participantNames: string[];
  onParticipantsChange: (value: number) => void;
  onParticipantNameChange: (index: number, value: string) => void;
  onStartDraft: () => void;
  nickname: string;
  onNicknameChange: (value: string) => void;
  isLoading?: boolean;
}

export const DraftCreation = ({
  participants,
  participantNames,
  onParticipantsChange,
  onParticipantNameChange,
  onStartDraft,
  nickname,
  onNicknameChange,
  isLoading = false,
}: DraftCreationProps) => {
  const handleParticipantsChange = (newValue: number) => {
    const validValue = Math.max(2, Math.min(10, newValue));
    onParticipantsChange(validValue);
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Create New Draft</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Draft Nickname
          </label>
          <Input
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder="Enter a nickname for your draft"
            className="w-full max-w-xs"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Participants
          </label>
          <Input
            type="number"
            min="2"
            max="10"
            value={participants}
            onChange={(e) => handleParticipantsChange(Number(e.target.value))}
            className="w-full max-w-xs"
          />
        </div>

        <div className="space-y-4">
          {Array.from({ length: participants }).map((_, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">
                Participant {index + 1} Name
              </label>
              <Input
                value={participantNames[index] || ""}
                onChange={(e) => onParticipantNameChange(index, e.target.value)}
                className="w-full max-w-xs"
              />
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
          onClick={onStartDraft}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Start Draft
        </Button>
      </div>
    </Card>
  );
};