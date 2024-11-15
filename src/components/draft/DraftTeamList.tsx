import { TeamCard } from "../TeamCard";
import { Card } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  teamNumber: number;
  teamName: string;
  districtPoints: number;
  stats: {
    wins: number;
    losses: number;
    opr: number;
    autoAvg: number;
  };
}

interface DraftTeamListProps {
  draftId: string;
  availableTeams: Team[];
  currentParticipant: string;
  onTeamSelect: (team: Team) => void;
}

export const DraftTeamList = ({
  draftId,
  availableTeams,
  currentParticipant,
  onTeamSelect,
}: DraftTeamListProps) => {
  const { toast } = useToast();

  const handleTeamSelect = async (team: Team) => {
    try {
      const { data: draft } = await supabase
        .from('drafts')
        .select('participants, draft_data')
        .eq('id', draftId)
        .single();

      if (!draft) {
        throw new Error('Draft not found');
      }

      const participants = draft.participants as Array<{ name: string; teams: Team[] }>;
      const draftData = draft.draft_data as { selectedTeams?: number[] };

      const updatedParticipants = participants.map((p) =>
        p.name === currentParticipant
          ? { ...p, teams: [...p.teams, team] }
          : p
      );

      const { error } = await supabase
        .from('drafts')
        .update({
          participants: updatedParticipants,
          draft_data: {
            ...draftData,
            selectedTeams: [...(draftData.selectedTeams || []), team.teamNumber],
          },
        })
        .eq('id', draftId);

      if (error) throw error;

      onTeamSelect(team);
      
      toast({
        title: "Team Selected",
        description: `${team.teamName} (${team.teamNumber}) has been drafted by ${currentParticipant}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableTeams.map((team) => (
          <TeamCard
            key={team.teamNumber}
            {...team}
            onSelect={() => handleTeamSelect(team)}
          />
        ))}
      </div>
    </Card>
  );
};