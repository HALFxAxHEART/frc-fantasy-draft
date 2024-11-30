import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { TeamBox } from "./TeamBox";
import { motion } from "framer-motion";

interface Team {
  name: string;
  participants: string[];
}

interface TeamManagementProps {
  teams: Team[];
  onTeamAdd: () => void;
  onTeamRemove: (index: number) => void;
  onTeamNameChange: (index: number, name: string) => void;
  onParticipantAdd: (teamIndex: number) => void;
  onParticipantRemove: (teamIndex: number, participantIndex: number) => void;
  onParticipantNameChange: (teamIndex: number, participantIndex: number, name: string) => void;
}

export const TeamManagement = ({
  teams,
  onTeamAdd,
  onTeamRemove,
  onTeamNameChange,
  onParticipantAdd,
  onParticipantRemove,
  onParticipantNameChange,
}: TeamManagementProps) => {
  const canStartDraft = teams.length > 0 && teams.every(team => team.participants.length > 0);

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Create Teams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, teamIndex) => (
          <motion.div
            key={teamIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: teamIndex * 0.1 }}
          >
            <TeamBox
              teamIndex={teamIndex}
              team={team}
              onRemove={() => onTeamRemove(teamIndex)}
              onTeamNameChange={(name) => onTeamNameChange(teamIndex, name)}
              onParticipantAdd={() => onParticipantAdd(teamIndex)}
              onParticipantRemove={(participantIndex) =>
                onParticipantRemove(teamIndex, participantIndex)
              }
              onParticipantNameChange={(participantIndex, name) =>
                onParticipantNameChange(teamIndex, participantIndex, name)
              }
            />
          </motion.div>
        ))}
      </div>
      {teams.length < 10 && (
        <Button
          variant="outline"
          onClick={onTeamAdd}
          className="w-full mt-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Team
        </Button>
      )}
    </Card>
  );
};