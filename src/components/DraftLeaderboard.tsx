import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";

interface DraftLeaderboardProps {
  draftId: string;
}

interface LeaderboardEntry {
  id: string;
  draft_id: string;
  participant_name: string;
  total_points: number;
  rank: number;
}

export const DraftLeaderboard = ({ draftId }: DraftLeaderboardProps) => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['draftLeaderboard', draftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('draft_leaderboards')
        .select('*')
        .eq('draft_id', draftId)
        .order('rank', { ascending: true });
      
      if (error) throw error;
      return data as LeaderboardEntry[];
    },
    enabled: !!draftId, // Only run query if draftId exists
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">Loading leaderboard...</div>
      </Card>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">No leaderboard data available</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.id}
            className="flex justify-between items-center p-2 rounded-lg hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">#{entry.rank}</span>
              <span>{entry.participant_name}</span>
            </div>
            <span className="font-semibold">{entry.total_points} pts</span>
          </div>
        ))}
      </div>
    </Card>
  );
};