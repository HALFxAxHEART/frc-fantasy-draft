import { DraftStateProvider } from "@/components/draft/DraftStateProvider";
import { DraftContent } from "@/components/draft/DraftContent";
import { DraftSharing } from "@/components/DraftSharing";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Draft = () => {
  const { draftId } = useParams();
  
  const { data: draft } = useQuery({
    queryKey: ['draft', draftId],
    queryFn: async () => {
      if (!draftId) return null;
      const { data } = await supabase
        .from('drafts')
        .select('share_code')
        .eq('id', draftId)
        .single();
      return data;
    },
    enabled: !!draftId,
  });

  return (
    <DraftStateProvider>
      <div className="space-y-4">
        {draft?.share_code && (
          <div className="max-w-md mx-auto px-4">
            <DraftSharing shareCode={draft.share_code} />
          </div>
        )}
        <DraftContent />
      </div>
    </DraftStateProvider>
  );
};

export default Draft;