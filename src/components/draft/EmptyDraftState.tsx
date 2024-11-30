import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DraftTeamList } from "./DraftTeamList";
import { Team } from "@/types/draft";
import { DraftOrder } from "@/components/DraftOrder";
import { useDraftState } from "./DraftStateProvider";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmptyDraftStateProps {
  draftId: string;
  teams: Team[];
}

export const EmptyDraftState = ({ draftId, teams }: EmptyDraftStateProps) => {
  const { draftState, setDraftState } = useDraftState();
  const { toast } = useToast();

  const handleTeamSelect = async (team: Team) => {
    try {
      const { data: draft } = await supabase
        .from('drafts')
        .select('teams')
        .eq('id', draftId)
        .single();

      if (!draft) {
        throw new Error('Draft not found');
      }

      const draftTeams = draft.teams as any[] || [];
      const currentTeam = draftTeams[draftState.currentParticipantIndex];

      if (!currentTeam) {
        throw new Error('Team not found');
      }

      const updatedTeams = draftTeams.map((t, index) => {
        if (index === draftState.currentParticipantIndex) {
          return {
            ...t,
            selectedTeams: [...(t.selectedTeams || []), team]
          };
        }
        return t;
      });

      const { error: updateError } = await supabase
        .from('drafts')
        .update({ teams: updatedTeams })
        .eq('id', draftId);

      if (updateError) throw updateError;

      const nextIndex = (draftState.currentParticipantIndex + 1) % draftTeams.length;
      setDraftState(prev => ({
        ...prev,
        currentParticipantIndex: nextIndex,
      }));

      toast({
        title: "Team Selected",
        description: `${team.teamName} has been drafted by Team ${currentTeam.name}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Get the teams from the draft data
  const draftTeams = (draftState.participants || []).map(team => ({
    name: team.name,
    teams: team.teams || []
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <DraftOrder
            participants={draftTeams}
            currentIndex={draftState.currentParticipantIndex}
          />
        </div>
        <div className="flex items-center justify-center">
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      {teams && teams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Teams:</h2>
          <DraftTeamList
            draftId={draftId}
            availableTeams={teams}
            currentParticipant={draftTeams[draftState.currentParticipantIndex]?.name || ""}
            onTeamSelect={handleTeamSelect}
            hidePoints
          />
        </div>
      )}
    </div>
  );
};