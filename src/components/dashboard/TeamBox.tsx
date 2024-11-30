import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, Minus, Users } from "lucide-react";
import { Label } from "../ui/label";

interface TeamBoxProps {
  teamIndex: number;
  onRemove: () => void;
  onTeamNameChange: (name: string) => void;
  onParticipantAdd: () => void;
  onParticipantRemove: (index: number) => void;
  onParticipantNameChange: (index: number, name: string) => void;
  team: {
    name: string;
    participants: string[];
  };
}

export const TeamBox = ({
  teamIndex,
  onRemove,
  onTeamNameChange,
  onParticipantAdd,
  onParticipantRemove,
  onParticipantNameChange,
  team,
}: TeamBoxProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Label className="text-sm font-medium mb-1">Team Name</Label>
          <Input
            value={team.name}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder={`Team ${teamIndex + 1}`}
          />
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={onRemove}
          className="mt-6"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {team.participants.map((participant, participantIndex) => (
          <div key={participantIndex} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                value={participant}
                onChange={(e) =>
                  onParticipantNameChange(participantIndex, e.target.value)
                }
                placeholder={`Participant ${participantIndex + 1}`}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onParticipantRemove(participantIndex)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {team.participants.length < 5 && (
          <Button
            variant="outline"
            onClick={onParticipantAdd}
            className="w-full"
          >
            <Users className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        )}
      </div>
    </Card>
  );
};