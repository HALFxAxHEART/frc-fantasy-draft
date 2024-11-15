import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UserDrafts = ({ userId }: { userId: string }) => {
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

  if (isLoading) return <div>Loading drafts...</div>;
  if (!drafts?.length) return <div>No drafts yet</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => (
        <Card key={draft.id}>
          <CardHeader>
            <CardTitle>{draft.event_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Status: {draft.status}</p>
            <p>Created: {new Date(draft.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};