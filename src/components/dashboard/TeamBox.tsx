import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, UserPlus, User } from "lucide-react";

interface TeamBoxProps {
  index: number;
  team: {
    name: string;
    participants: string[];
  };
  onUpdate: (index: number, team: { name: string; participants: string[] }) => void;
  onRemove: (index: number) => void;
}

export const TeamBox = ({ index, team, onUpdate, onRemove }: TeamBoxProps) => {
  const addParticipant = () => {
    onUpdate(index, {
      ...team,
      participants: [...team.participants, ""]
    });
  };

  const removeParticipant = (participantIndex: number) => {
    onUpdate(index, {
      ...team,
      participants: team.participants.filter((_, i) => i !== participantIndex)
    });
  };

  const updateParticipant = (participantIndex: number, value: string) => {
    const newParticipants = [...team.participants];
    newParticipants[participantIndex] = value;
    onUpdate(index, {
      ...team,
      participants: newParticipants
    });
  };

  return (
    <Card className="w-72 p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label>Team {index + 1}</Label>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Input
        value={team.name}
        onChange={(e) => onUpdate(index, { ...team, name: e.target.value })}
        placeholder="Enter team name"
      />

      <div className="space-y-2">
        {team.participants.map((participant, pIndex) => (
          <div key={pIndex} className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Input
              value={participant}
              onChange={(e) => updateParticipant(pIndex, e.target.value)}
              placeholder={`Participant ${pIndex + 1}`}
              className="flex-1"
            />
            {team.participants.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeParticipant(pIndex)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addParticipant}
        className="w-full gap-2"
      >
        <UserPlus className="h-4 w-4" />
        Add Participant
      </Button>
    </Card>
  );
};