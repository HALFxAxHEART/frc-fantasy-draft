import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const GlobalDraft = () => {
  const { draftId } = useParams();

  const { data: draft, isLoading } = useQuery({
    queryKey: ['globalDraft', draftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!draft) {
    return <div>Draft not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{draft.name || `Season ${draft.season_year} Draft`}</h1>
      {/* Add more draft details and functionality here */}
    </div>
  );
};

export default GlobalDraft;