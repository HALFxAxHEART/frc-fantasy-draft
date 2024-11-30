import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { TeamSetup } from "./TeamSetup";

interface Team {
  name: string;
  participantCount: number;
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
      </div>
    </Card>
  );
};