import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/tba-api";
import { supabase } from "@/lib/supabase";
import { UserHeader } from "@/components/dashboard/UserHeader";
import { DraftsList } from "@/components/dashboard/DraftsList";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { DraftCreation } from "@/components/DraftCreation";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [participants, setParticipants] = useState(2);
  const [participantNames, setParticipantNames] = useState(["", ""]);
  
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', selectedYear],
    queryFn: () => fetchEvents(selectedYear),
  });

  const { data: userDrafts, isLoading: draftsLoading } = useQuery({
    queryKey: ['drafts'],
    queryFn: async () => {
      const { data: drafts, error } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return drafts;
    },
  });

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', user.id)
            .single();
          
          if (profile) setDisplayName(profile.display_name);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, []);

  // Show loading spinner while initial profile data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If we're not loading the profile anymore but don't have a display name, something went wrong
  if (!isLoading && !displayName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">Unable to load user profile. Please try refreshing the page.</p>
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
        <UserHeader displayName={displayName} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <DraftCreation
              participants={participants}
              participantNames={participantNames}
              onParticipantsChange={setParticipants}
              onParticipantNameChange={(index, value) => {
                const newNames = [...participantNames];
                newNames[index] = value;
                setParticipantNames(newNames);
              }}
              onStartDraft={() => {}}
            />
            <DraftsList drafts={userDrafts || []} isLoading={draftsLoading} />
          </div>

          <div className="space-y-8">
            <UpcomingEvents 
              events={events || []} 
              isLoading={eventsLoading}
              onSelectEvent={setSelectedEvent}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;