import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/tba-api";
import { supabase } from "@/lib/supabase";
import { UserHeader } from "@/components/dashboard/UserHeader";
import { DraftsList } from "@/components/dashboard/DraftsList";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { DraftCreation } from "@/components/DraftCreation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch user's drafts
  const { data: drafts, isLoading: draftsLoading } = useQuery({
    queryKey: ['drafts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile,
  });

  // Fetch upcoming events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(new Date().getFullYear()),
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
          <p>Unable to load user profile. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <UserHeader displayName={profile.display_name} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <DraftCreation
              events={events || []}
              isLoading={eventsLoading}
              onCreateDraft={async (eventKey: string, eventName: string) => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { error } = await supabase
                  .from('drafts')
                  .insert({
                    user_id: user.id,
                    event_key: eventKey,
                    event_name: eventName,
                  });

                if (error) {
                  toast({
                    title: "Error",
                    description: "Failed to create draft",
                    variant: "destructive",
                  });
                  return;
                }

                toast({
                  title: "Success",
                  description: "Draft created successfully",
                });
              }}
            />
            <DraftsList 
              drafts={drafts || []} 
              isLoading={draftsLoading}
            />
          </div>

          <div className="space-y-8">
            <UpcomingEvents 
              events={events || []} 
              isLoading={eventsLoading}
              onSelectEvent={(eventKey) => {
                toast({
                  title: "Event Selected",
                  description: "You can now create a draft for this event",
                });
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;