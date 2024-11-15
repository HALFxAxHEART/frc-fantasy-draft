import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, ArrowRight } from "lucide-react";

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

      // Refresh the drafts list
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => (
        <Card key={draft.id} className="relative">
          <CardHeader>
            <CardTitle className="text-lg">{draft.event_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Status: {draft.status}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Created: {new Date(draft.created_at).toLocaleDateString()}
            </p>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(draft.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDraft(draft.id)}
                className="gap-2"
              >
                View Draft
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};