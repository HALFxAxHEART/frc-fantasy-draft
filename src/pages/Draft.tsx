import { DraftStateProvider } from "@/components/draft/DraftStateProvider";
import { DraftContent } from "@/components/draft/DraftContent";
import { DraftSharing } from "@/components/DraftSharing";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Draft = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  
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
        <div className="max-w-7xl mx-auto px-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
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