import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Plus, Minus, UserPlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Team {
  name: string;
  participantCount: number;
  participants: string[];
}

interface TeamSetupProps {
  teams: Team[];
  onTeamsChange: (teams: Team[]) => void;
  onStartDraft: () => void;
}

export const TeamSetup = ({ teams, onTeamsChange, onStartDraft }: TeamSetupProps) => {
  const addTeam = () => {
    onTeamsChange([...teams, { name: "", participantCount: 1, participants: [""] }]);
  };

  const removeTeam = (index: number) => {
    const newTeams = teams.filter((_, i) => i !== index);
    onTeamsChange(newTeams);
  };

  const updateTeam = (index: number, field: keyof Team, value: string | number) => {
    const newTeams = [...teams];
    if (field === 'participantCount') {
      const count = Number(value);
      const currentParticipants = newTeams[index].participants || [];
      if (count > currentParticipants.length) {
        // Add new empty participant slots
        newTeams[index].participants = [
          ...currentParticipants,
          ...Array(count - currentParticipants.length).fill("")
        ];
      } else {
        // Remove excess participant slots
        newTeams[index].participants = currentParticipants.slice(0, count);
      }
    }
    newTeams[index] = { ...newTeams[index], [field]: value };
    onTeamsChange(newTeams);
  };

  const updateParticipant = (teamIndex: number, participantIndex: number, value: string) => {
    const newTeams = [...teams];
    if (!newTeams[teamIndex].participants) {
      newTeams[teamIndex].participants = [];
    }
    newTeams[teamIndex].participants[participantIndex] = value;
    onTeamsChange(newTeams);
  };

  const removeParticipant = (teamIndex: number, participantIndex: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants = newTeams[teamIndex].participants.filter((_, i) => i !== participantIndex);
    newTeams[teamIndex].participantCount = newTeams[teamIndex].participants.length;
    onTeamsChange(newTeams);
  };

  const addParticipant = (teamIndex: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants.push("");
    newTeams[teamIndex].participantCount = newTeams[teamIndex].participants.length;
    onTeamsChange(newTeams);
  };

  const canStartDraft = teams.length > 0 && teams.every(team => 
    team.name && 
    team.participants.length > 0 && 
    team.participants.every(participant => participant.trim() !== "")
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {teams.map((team, index) => (
            <motion.div
              key={index}
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
                  onClick={() => removeTeam(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <div className="space-y-2">
                  <Label>Team Name</Label>
                  <Input
                    value={team.name}
                    onChange={(e) => updateTeam(index, "name", e.target.value)}
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
                          onChange={(e) => updateParticipant(index, pIndex, e.target.value)}
                          placeholder={`Participant ${pIndex + 1}`}
                        />
                        {team.participants.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeParticipant(index, pIndex)}
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
                    onClick={() => addParticipant(index)}
                    className="w-full mt-2"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Participant
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card 
              className="p-4 flex items-center justify-center h-full cursor-pointer hover:bg-accent transition-colors"
              onClick={addTeam}
            >
              <Button variant="ghost" size="icon">
                <Plus className="h-6 w-6" />
              </Button>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        className="w-full"
        disabled={!canStartDraft}
        onClick={onStartDraft}
      >
        Start Draft
      </Button>
    </div>
  );
};