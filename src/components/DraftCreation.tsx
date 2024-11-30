import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface Team {
  name: string;
  participants: string[];
}

interface DraftCreationProps {
  onStartDraft: () => void;
  nickname: string;
  onNicknameChange: (value: string) => void;
}

export const DraftCreation = ({
  onStartDraft,
  nickname,
  onNicknameChange,
}: DraftCreationProps) => {
  const [teams, setTeams] = useState<Team[]>([{ name: '', participants: [''] }]);

  const addTeam = () => {
    if (teams.length < 10) {
      setTeams([...teams, { name: '', participants: [''] }]);
    }
  };

  const removeTeam = (teamIndex: number) => {
    setTeams(teams.filter((_, index) => index !== teamIndex));
  };

  const addParticipant = (teamIndex: number) => {
    if (teams[teamIndex].participants.length < 5) {
      const newTeams = [...teams];
      newTeams[teamIndex].participants.push('');
      setTeams(newTeams);
    }
  };

  const removeParticipant = (teamIndex: number, participantIndex: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants = newTeams[teamIndex].participants.filter(
      (_, index) => index !== participantIndex
    );
    setTeams(newTeams);
  };

  const updateTeamName = (teamIndex: number, name: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].name = name;
    setTeams(newTeams);
  };

  const updateParticipantName = (
    teamIndex: number,
    participantIndex: number,
    name: string
  ) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants[participantIndex] = name;
    setTeams(newTeams);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Draft Nickname (Optional)
          </label>
          <Input
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder="Enter a nickname for your draft"
            className="w-full max-w-xs"
          />
        </div>

        <div className="space-y-6">
          {teams.map((team, teamIndex) => (
            <div key={teamIndex} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <label className="block text-sm font-medium mb-1">
                    Team {teamIndex + 1} Name
                  </label>
                  <Input
                    value={team.name}
                    onChange={(e) => updateTeamName(teamIndex, e.target.value)}
                    placeholder={`Team ${teamIndex + 1}`}
                  />
                </div>
                {teams.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeTeam(teamIndex)}
                    className="mt-6"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {team.participants.map((participant, participantIndex) => (
                  <div key={participantIndex} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        value={participant}
                        onChange={(e) =>
                          updateParticipantName(
                            teamIndex,
                            participantIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Participant ${participantIndex + 1}`}
                      />
                    </div>
                    {team.participants.length > 1 && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          removeParticipant(teamIndex, participantIndex)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {team.participants.length < 5 && (
                  <Button
                    variant="outline"
                    onClick={() => addParticipant(teamIndex)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Participant
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {teams.length < 10 && (
          <Button
            variant="outline"
            onClick={addTeam}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </Button>
        )}

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
          onClick={onStartDraft}
        >
          Start Draft
        </Button>
      </div>
    </div>
  );
};