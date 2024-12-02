import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface TeamCardProps {
  team: {
    name: string;
    participants: string[];
  };
  index: number;
  onTeamNameChange: (value: string) => void;
  onParticipantChange: (participantIndex: number, value: string) => void;
  onRemoveParticipant: (participantIndex: number) => void;
  onAddParticipant: () => void;
  onRemoveTeam: () => void;
}

export const TeamCard = ({
  team,
  index,
  onTeamNameChange,
  onParticipantChange,
  onRemoveParticipant,
  onAddParticipant,
  onRemoveTeam,
}: TeamCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative"
    >
      <Card className="p-4 space-y-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onRemoveTeam}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="space-y-2">
          <Label>Team Name</Label>
          <Input
            value={team.name}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder="Enter team name"
          />
        </div>

        <div className="space-y-2">
          <Label>Participants</Label>
          <div className="space-y-2">
            {team.participants.map((participant, pIndex) => (
              <div key={pIndex} className="flex items-center gap-2">
                <Input
                  value={participant}
                  onChange={(e) => onParticipantChange(pIndex, e.target.value)}
                  placeholder={`Participant ${pIndex + 1}`}
                />
                {team.participants.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveParticipant(pIndex)}
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
            onClick={onAddParticipant}
            className="w-full mt-2"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};