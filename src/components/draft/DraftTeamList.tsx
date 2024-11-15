import { Card } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamCard } from "../TeamCard";
import { Json } from "@/integrations/supabase/types";

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

interface DraftParticipant {
  name: string;
  teams: Team[];
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

      const participants = (draft.participants as unknown as DraftParticipant[]) || [];
      const draftData = (draft.draft_data as { selectedTeams?: number[] }) || {};
      const selectedTeams = draftData.selectedTeams || [];

      if (selectedTeams.includes(team.teamNumber)) {
        toast({
          title: "Team Already Selected",
          description: "This team has already been drafted.",
          variant: "destructive",
        });
        return;
      }

      const updatedParticipants = participants.map(p =>
        p.name === currentParticipant
          ? { ...p, teams: [...p.teams, team] }
          : p
      );

      const { error: updateError } = await supabase
        .from('drafts')
        .update({
          participants: updatedParticipants as unknown as Json,
          draft_data: {
            selectedTeams: [...selectedTeams, team.teamNumber],
            availableTeams: availableTeams.filter(t => t.teamNumber !== team.teamNumber).map(t => ({
              teamNumber: t.teamNumber,
              teamName: t.teamName,
              districtPoints: t.districtPoints,
              stats: {
                wins: t.stats.wins,
                losses: t.stats.losses,
                opr: t.stats.opr,
                autoAvg: t.stats.autoAvg
              }
            }))
          } as unknown as Json
        })
        .eq('id', draftId);

      if (updateError) throw updateError;

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