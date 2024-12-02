import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { TeamSetup } from "./TeamSetup";
import { DraftOrder } from "./DraftOrder";

interface Team {
  name: string;
  participantCount: number;
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
  const [teams, setTeams] = useState<Team[]>([]);

  const draftTeams = teams.map(team => ({
    name: team.participants[0] || "",  // Use the first participant as the team name
    participants: team.participants,
    selectedTeams: []
  }));

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Create New Draft</h2>
      
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

        <TeamSetup
          teams={teams}
          onTeamsChange={setTeams}
          onStartDraft={onStartDraft}
        />

        {teams.length > 0 && (
          <DraftOrder
            teams={draftTeams}
            currentIndex={-1}
          />
        )}
      </div>
    </Card>
  );
};