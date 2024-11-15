import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { DraftData, Team } from "@/types/draft";

interface DatabaseDraftData {
  participants: Json;
  draft_data: Json;
  event_name: string;
  event_key: string;
  nickname?: string;
}

export const useDraftData = (draftId: string | undefined) => {
  return useQuery({
    queryKey: ['draft', draftId],
    queryFn: async () => {
      if (!draftId) throw new Error('Draft ID is required');
      
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', draftId)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Draft not found');

      const dbData = data as DatabaseDraftData;

      // Create default teams if none exist
      const defaultTeams: Team[] = Array.from({ length: 30 }, (_, i) => ({
        teamNumber: 254 + i,
        teamName: `Team ${254 + i}`,
        districtPoints: Math.floor(Math.random() * 100),
        stats: {
          wins: Math.floor(Math.random() * 10),
          losses: Math.floor(Math.random() * 10),
          opr: Math.random() * 50,
          autoAvg: Math.random() * 10
        }
      }));

      // Parse the draft data with proper type assertions
      const availableTeams = dbData?.draft_data && 
        typeof dbData.draft_data === 'object' && 
        'availableTeams' in dbData.draft_data
        ? (dbData.draft_data.availableTeams as unknown as Team[])
        : defaultTeams;

      const participants = dbData?.participants 
        ? (dbData.participants as unknown as Array<{ name: string; teams: Team[] }>)
        : [];

      const typedData: DraftData = {
        participants,
        draft_data: {
          availableTeams
        },
        event_name: dbData?.event_name || '',
        event_key: dbData?.event_key || '',
        nickname: dbData?.nickname
      };
      
      return typedData;
    },
    enabled: !!draftId,
    retry: 1,
  });
};