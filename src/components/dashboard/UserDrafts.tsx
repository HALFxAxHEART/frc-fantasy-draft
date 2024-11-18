import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, ArrowRight, Trophy, Eye, Share2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fetchEventDetails } from "@/services/tbaService";
import { DraftSharing } from "@/components/DraftSharing";

export const UserDrafts = ({ userId }: { userId: string }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: drafts, isLoading } = useQuery({
    queryKey: ['drafts', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch event details for each draft
  const { data: eventDetails } = useQuery({
    queryKey: ['draftEvents', drafts?.map(d => d.event_key)],
    queryFn: async () => {
      if (!drafts) return {};
      const details = await Promise.all(
        drafts.map(draft => fetchEventDetails(draft.event_key))
      );
      return Object.fromEntries(
        drafts.map((draft, i) => [draft.event_key, details[i]])
      );
    },
    enabled: !!drafts?.length,
  });

  const handleDelete = async (draftId: string) => {
    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Draft deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['drafts', userId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete draft",
        variant: "destructive",
      });
    }
  };

  const handleViewDraft = (draftId: string) => {
    navigate(`/draft/${draftId}`);
  };

  if (isLoading) return <div>Loading drafts...</div>;
  if (!drafts?.length) return <div>No drafts yet</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drafts?.map((draft) => {
          const event = eventDetails?.[draft.event_key];
          const isEventEnded = event && new Date(event.end_date) < new Date();

          return (
            <Card key={draft.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{draft.event_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-100 mb-4">
                  Status: {draft.status}
                </p>
                {event && (
                  <div className="text-sm text-muted-foreground mb-4">
                    <p className="text-gray-100">Start: {format(new Date(event.start_date), 'PPP')}</p>
                    <p className="text-gray-100">End: {format(new Date(event.end_date), 'PPP')}</p>
                  </div>
                )}
                {draft.share_code && (
                  <div className="mb-4">
                    <DraftSharing shareCode={draft.share_code} />
                  </div>
                )}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(draft.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-x-2">
                    {isEventEnded && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/results/${draft.id}`)}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Results
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDraft(draft.id)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Draft
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};