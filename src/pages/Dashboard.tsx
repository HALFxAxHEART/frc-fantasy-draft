import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/tba-api";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { DraftStats } from "@/components/DraftStats";
import { supabase } from "@/integrations/supabase/client";
import { UserDrafts } from "@/components/dashboard/UserDrafts";
import { DraftCreationSection } from "@/components/dashboard/DraftCreationSection";

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events', selectedYear],
    queryFn: () => fetchEvents(selectedYear),
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (session) {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEventSelect = (eventKey: string) => {
    setSelectedEvent(eventKey);
  };

  return (
    <div className="h-full p-4 md:p-8 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold px-2">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {userId && (
            <DraftCreationSection
              userId={userId}
              events={events}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              selectedDistrict={selectedDistrict}
              onDistrictChange={setSelectedDistrict}
              selectedEvent={selectedEvent}
              onEventChange={setSelectedEvent}
              isLoading={isLoading}
              error={error instanceof Error ? error : null}
            />
          )}

          <div className="space-y-6 md:space-y-8">
            {userId && <UserDrafts userId={userId} />}
            <UpcomingEvents
              events={events}
              onEventSelect={handleEventSelect}
              isLoading={isLoading}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;