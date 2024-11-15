import { supabase } from "@/integrations/supabase/client";
import { Team, DraftParticipant } from "@/types/draft";
import { Json } from "@/integrations/supabase/types";

export const selectTeam = async (
  draftId: string,
  team: Team,
  participants: DraftParticipant[],
  currentParticipant: string,
  availableTeams: Team[]
) => {
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
};