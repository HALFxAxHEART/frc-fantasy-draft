import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { TeamCard } from "./team-setup/TeamCard";
import { AddTeamCard } from "./team-setup/AddTeamCard";

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

  const updateTeamName = (index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], name: value };
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
            <TeamCard
              key={index}
              team={team}
              index={index}
              onTeamNameChange={(value) => updateTeamName(index, value)}
              onParticipantChange={(pIndex, value) => updateParticipant(index, pIndex, value)}
              onRemoveParticipant={(pIndex) => removeParticipant(index, pIndex)}
              onAddParticipant={() => addParticipant(index)}
              onRemoveTeam={() => removeTeam(index)}
            />
          ))}
          <AddTeamCard onAddTeam={addTeam} />
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