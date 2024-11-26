import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Users } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { TeamSettings } from "./draft/TeamSettings";
import { TeamList } from "./draft/TeamList";
import { DraftTeam } from "@/types/draftCreation";

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
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [participantsPerTeam, setParticipantsPerTeam] = useState(1);
  const [teams, setTeams] = useState<DraftTeam[]>([
    { name: "Team 1", participants: [""] },
    { name: "Team 2", participants: [""] },
  ]);
  const { toast } = useToast();

  const handleTeamNameChange = (index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index].name = value;
    setTeams(newTeams);
  };

  const handleParticipantChange = (teamIndex: number, participantIndex: number, value: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants[participantIndex] = value;
    setTeams(newTeams);
  };

  const updateNumberOfTeams = (newNumber: number) => {
    if (newNumber < 2) {
      toast({
        title: "Invalid number of teams",
        description: "You must have at least 2 teams",
        variant: "destructive",
      });
      return;
    }
    if (newNumber > 10) {
      toast({
        title: "Invalid number of teams",
        description: "Maximum number of teams is 10",
        variant: "destructive",
      });
      return;
    }
    setNumberOfTeams(newNumber);
    if (newNumber > teams.length) {
      // Add new teams
      const newTeams = [...teams];
      for (let i = teams.length; i < newNumber; i++) {
        newTeams.push({
          name: `Team ${i + 1}`,
          participants: Array(participantsPerTeam).fill(""),
        });
      }
      setTeams(newTeams);
    } else {
      // Remove teams
      setTeams(teams.slice(0, newNumber));
    }
  };

  const updateParticipantsPerTeam = (newNumber: number) => {
    if (newNumber < 1) {
      toast({
        title: "Invalid number of participants",
        description: "Each team must have at least 1 participant",
        variant: "destructive",
      });
      return;
    }
    if (newNumber > 5) {
      toast({
        title: "Invalid number of participants",
        description: "Maximum number of participants per team is 5",
        variant: "destructive",
      });
      return;
    }
    setParticipantsPerTeam(newNumber);
    const newTeams = teams.map(team => ({
      ...team,
      participants: Array(newNumber).fill("").map((_, i) => team.participants[i] || ""),
    }));
    setTeams(newTeams);
  };

  const handleStartDraft = () => {
    // Validate all teams have names and all participants are filled
    const hasEmptyTeamNames = teams.some(team => !team.name.trim());
    const hasEmptyParticipants = teams.some(team => 
      team.participants.some(participant => !participant.trim())
    );

    if (hasEmptyTeamNames) {
      toast({
        title: "Missing team names",
        description: "Please provide names for all teams",
        variant: "destructive",
      });
      return;
    }

    if (hasEmptyParticipants) {
      toast({
        title: "Missing participants",
        description: "Please fill in all participant names for each team",
        variant: "destructive",
      });
      return;
    }

    onStartDraft();
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Create New Draft</h2>
      
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-1">
            Draft Nickname (Optional)
          </Label>
          <Input
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder="Enter a nickname for your draft"
            className="w-full max-w-xs"
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Team Settings</h3>
          <TeamSettings
            numberOfTeams={numberOfTeams}
            participantsPerTeam={participantsPerTeam}
            onTeamsChange={updateNumberOfTeams}
            onParticipantsPerTeamChange={updateParticipantsPerTeam}
          />
        </div>

        <Separator />

        <div className="space-y-6">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teams and Participants
          </h3>
          
          <TeamList
            teams={teams}
            onTeamNameChange={handleTeamNameChange}
            onParticipantChange={handleParticipantChange}
          />
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
          onClick={handleStartDraft}
        >
          Start Draft
        </Button>
      </div>
    </Card>
  );
};