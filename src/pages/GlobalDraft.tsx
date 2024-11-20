import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserMinus } from "lucide-react";
import { useState, useEffect } from "react";

const GlobalDraft = () => {
  const { draftId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
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

  const { data: draft, isLoading: isDraftLoading } = useQuery({
    queryKey: ['globalDraft', draftId],
    queryFn: async () => {
      if (!draftId) throw new Error('Draft ID is required');
      
      const { data, error } = await supabase
        .from('global_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: participants, isLoading: isParticipantsLoading } = useQuery({
    queryKey: ['globalDraftParticipants', draftId],
    queryFn: async () => {
      if (!draftId) throw new Error('Draft ID is required');
      
      const { data, error } = await supabase
        .from('global_draft_participants')
        .select(`
          *,
          profiles:user_id (
            id,
            display_name
          )
        `)
        .eq('global_draft_id', draftId);

      if (error) throw error;
      return data;
    },
  });

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      const { error } = await supabase
        .from('global_draft_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Participant removed successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['globalDraftParticipants', draftId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isDraftLoading || isParticipantsLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!draft) {
    return <div className="container mx-auto py-8">Draft not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{draft.name || `Season ${draft.season_year} Draft`}</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Participants</h2>
          <div className="space-y-4">
            {participants?.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span>{participant.profiles?.display_name || 'Unknown User'}</span>
                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveParticipant(participant.id)}
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            ))}
            {(!participants || participants.length === 0) && (
              <p className="text-muted-foreground text-center">No participants yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GlobalDraft;