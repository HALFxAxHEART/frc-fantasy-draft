import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Team {
  name: string;
  participantCount: number;
}

interface TeamSetupProps {
  teams: Team[];
  onTeamsChange: (teams: Team[]) => void;
  onStartDraft: () => void;
}

export const TeamSetup = ({ teams, onTeamsChange, onStartDraft }: TeamSetupProps) => {
  const addTeam = () => {
    onTeamsChange([...teams, { name: "", participantCount: 1 }]);
  };

  const removeTeam = (index: number) => {
    const newTeams = teams.filter((_, i) => i !== index);
    onTeamsChange(newTeams);
  };

  const updateTeam = (index: number, field: keyof Team, value: string | number) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], [field]: value };
    onTeamsChange(newTeams);
  };

  const canStartDraft = teams.length > 0 && teams.every(team => team.name && team.participantCount > 0);

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
                  <Label>Number of Participants</Label>
                  <Input
                    type="number"
                    min="1"
                    value={team.participantCount}
                    onChange={(e) => updateTeam(index, "participantCount", parseInt(e.target.value) || 0)}
                  />
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