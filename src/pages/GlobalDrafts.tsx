import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { GlobalDraftHeader } from "@/components/global-draft/GlobalDraftHeader";
import { CreateGlobalDraftDialog } from "@/components/global-draft/CreateGlobalDraftDialog";
import { GlobalDraftCard } from "@/components/global-draft/GlobalDraftCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GlobalDrafts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      }
    };

    checkAdminStatus();
  }, []);

  const { data: activeDraft, isLoading: isDraftLoading } = useQuery({
    queryKey: ['globalDraft', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_drafts')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
  });

  const handleJoinDraft = async (draftId: string) => {
    try {
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to join the draft",
          variant: "destructive",
        });
        return;
      }

      const { data: existingParticipant } = await supabase
        .from('global_draft_participants')
        .select('id')
        .eq('global_draft_id', draftId)
        .eq('user_id', userId)
        .single();

      if (existingParticipant) {
        navigate(`/global-drafts/${draftId}`);
        return;
      }

      const { error } = await supabase
        .from('global_draft_participants')
        .insert({
          global_draft_id: draftId,
          user_id: userId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You've joined the global draft!",
      });
      
      navigate(`/global-drafts/${draftId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isDraftLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <GlobalDraftHeader title="Global Drafts" />
          {isAdmin && <CreateGlobalDraftDialog />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeDraft?.map((draft) => (
            <GlobalDraftCard
              key={draft.id}
              draft={{
                ...draft,
                settings: {
                  eventType: (draft.settings as any)?.eventType || 'all'
                }
              }}
              onJoin={handleJoinDraft}
            />
          ))}
          {(!activeDraft || activeDraft.length === 0) && (
            <p className="text-muted-foreground col-span-2 text-center">
              No active drafts at the moment
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalDrafts;