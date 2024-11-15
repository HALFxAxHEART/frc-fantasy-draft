import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const DraftControls = ({
  participants,
  participantNames,
  onParticipantsChange,
  onParticipantNameChange,
  onStartDraft,
}: {
  participants: number;
  participantNames: string[];
  onParticipantsChange: (value: number) => void;
  onParticipantNameChange: (index: number, value: string) => void;
  onStartDraft: () => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Number of Participants</Label>
        <Input
          type="number"
          min="2"
          max="10"
          value={participants}
          onChange={(e) => onParticipantsChange(parseInt(e.target.value))}
        />
      </div>
      {Array.from({ length: participants }).map((_, index) => (
        <div key={index}>
          <Label>Participant {index + 1} Name</Label>
          <Input
            value={participantNames[index] || ""}
            onChange={(e) => onParticipantNameChange(index, e.target.value)}
            placeholder={`Participant ${index + 1}`}
          />
        </div>
      ))}
      <Button onClick={onStartDraft} className="w-full">
        Start Draft
      </Button>
    </div>
  );
};