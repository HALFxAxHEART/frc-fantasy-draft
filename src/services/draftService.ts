import { supabase } from "@/integrations/supabase/client";
import { Team, DraftParticipant } from "@/types/draft";
import { Json } from "@/integrations/supabase/types";

export const selectTeam = async (
  draftId: string,
  team: Team,
  participants: DraftParticipant[],
  currentParticipant: string,
  availableTeams: Team[],
  isGlobalDraft: boolean = false
) => {
  if (isGlobalDraft) {
    const { data: participant, error: participantError } = await supabase
      .from('global_draft_participants')
      .select('*')
      .eq('global_draft_id', draftId)
      .eq('user_id', currentParticipant)
      .single();

    if (participantError) throw participantError;

    const selectedTeams = participant.selected_teams as Team[] || [];
    const updatedTeams = [...selectedTeams, team];

    const { error: updateError } = await supabase
      .from('global_draft_participants')
      .update({
        selected_teams: updatedTeams,
        current_pick: (participant.current_pick || 0) + 1
      })
      .eq('id', participant.id);

    if (updateError) throw updateError;

    return {
      updatedParticipants: participants,
      updatedAvailableTeams: availableTeams.filter(t => t.teamNumber !== team.teamNumber)
    };
  } else {
    const updatedParticipants = participants.map(p =>
      p.name === currentParticipant
        ? { ...p, teams: [...p.teams, team] }
        : p
    );

    const updatedAvailableTeams = availableTeams.filter(
      t => t.teamNumber !== team.teamNumber
    );

    const { error } = await supabase
      .from('drafts')
      .update({
        participants: updatedParticipants as unknown as Json,
        draft_data: {
          availableTeams: updatedAvailableTeams
        } as unknown as Json
      })
      .eq('id', draftId);

    if (error) throw error;

    return {
      updatedParticipants,
      updatedAvailableTeams
    };
  }
};