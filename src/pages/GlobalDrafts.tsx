import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface GlobalDraft {
  id: string;
  season_year: number;
  status: string;
  global_draft_participants: {
    id: string;
  }[];
}

interface LeaderboardEntry {
  id: string;
  total_points: number;
  rank: number;
  profiles: {
    display_name: string | null;
    profile_picture_url: string | null;
  } | null;
}

const GlobalDrafts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const { data: activeDraft, isLoading: isDraftLoading } = useQuery({
    queryKey: ['globalDraft', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_drafts')
        .select('*, global_draft_participants(*)')
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data as GlobalDraft | null;
    },
  });

  const { data: leaderboard, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ['globalDraftLeaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_draft_participants')
        .select(`
          id,
          total_points,
          rank,
          profiles (
            display_name,
            profile_picture_url
          )
        `)
        .order('rank', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });

  const handleCreateGlobalDraft = async () => {
    if (!isAdmin) {
      toast({
        title: "Error",
        description: "Only admins can create global drafts",
        variant: "destructive",
      });
      return;
    }

    try {
      const currentYear = new Date().getFullYear();
      const { error } = await supabase
        .from('global_drafts')
        .insert({
          season_year: currentYear,
          start_date: new Date().toISOString(),
          end_date: new Date(currentYear, 11, 31).toISOString(),
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Global draft created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleJoinDraft = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to join the draft",
          variant: "destructive",
        });
        return;
      }

      if (!activeDraft) {
        toast({
          title: "Error",
          description: "No active draft available to join",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('global_draft_participants')
        .insert({
          global_draft_id: activeDraft.id,
          user_id: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You've joined the global draft!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isDraftLoading || isLeaderboardLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Global Drafts</h1>
          {isAdmin && (
            <Button onClick={handleCreateGlobalDraft}>
              Create Global Draft
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Current Season Draft</h2>
            {activeDraft ? (
              <div className="space-y-4">
                <p>Season: {activeDraft.season_year}</p>
                <p>Status: {activeDraft.status}</p>
                <p>Participants: {activeDraft.global_draft_participants.length}</p>
                <Button onClick={handleJoinDraft}>Join Draft</Button>
              </div>
            ) : (
              <p>No active draft at the moment</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Top Drafters</h2>
            <div className="space-y-4">
              {leaderboard?.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{entry.rank}</span>
                    <span>{entry.profiles?.display_name ?? 'Unknown User'}</span>
                  </div>
                  <span>{entry.total_points} pts</span>
                </motion.div>
              ))}
              {(!leaderboard || leaderboard.length === 0) && (
                <p className="text-muted-foreground">No rankings available yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalDrafts;
