import { Card } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

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
  });

  if (isLoading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-bold">Draft Leaderboard</h2>
      </div>
      <div className="space-y-2">
        {leaderboard?.map((entry) => (
          <div 
            key={entry.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold">{entry.rank}</span>
              <span>{entry.participant_name}</span>
            </div>
            <span className="font-semibold">{entry.total_points} pts</span>
          </div>
        ))}
      </div>
    </Card>
  );
};