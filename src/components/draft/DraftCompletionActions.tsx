import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DraftCompletionActionsProps {
  draftId: string;
}

export const DraftCompletionActions = ({ draftId }: DraftCompletionActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const finalizeDraft = async () => {
    try {
      const { error } = await supabase
        .from('drafts')
        .update({ status: 'completed' })
        .eq('id', draftId);

      if (error) throw error;

      toast({
        title: "Draft Finalized",
        description: "Draft results have been saved successfully.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to finalize draft results.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      <Button onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
      <Button onClick={finalizeDraft} variant="default">
        Finalize Results
      </Button>
    </div>
  );
};