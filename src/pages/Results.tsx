import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DraftResults } from "@/components/DraftResults";
import { DraftParticipant } from "@/types/draft";

const Results = () => {
  const { draftId } = useParams();

  const { data: draft, isLoading } = useQuery({
    queryKey: ['draft', draftId],
    queryFn: async () => {
      if (!draftId) throw new Error('Draft ID is required');
      
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', draftId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading results...</div>;
  }

  if (!draft) {
    return <div>Draft not found</div>;
  }

  // Cast the participants with a type assertion after validating the structure
  const participants = (draft.participants || []) as unknown as DraftParticipant[];

  return (
    <DraftResults
      draftId={draftId || ''}
      participants={participants}
      eventName={draft.event_name}
    />
  );
};

export default Results;