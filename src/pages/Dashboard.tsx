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
import { TeamManagement } from "@/components/dashboard/TeamManagement";

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [teams, setTeams] = useState<Array<{ name: string; participants: string[] }>>([
    { name: '', participants: [''] }
  ]);
  
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

  const addTeam = () => {
    if (teams.length < 10) {
      setTeams([...teams, { name: '', participants: [''] }]);
    } else {
      toast({
        title: "Maximum Teams Reached",
        description: "You can only create up to 10 teams.",
        variant: "destructive",
      });
    }
  };

  const removeTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  };

  const addParticipant = (teamIndex: number) => {
    if (teams[teamIndex].participants.length < 5) {
      const newTeams = [...teams];
      newTeams[teamIndex].participants.push('');
      setTeams(newTeams);
    } else {
      toast({
        title: "Maximum Participants Reached",
        description: "You can only add up to 5 participants per team.",
        variant: "destructive",
      });
    }
  };

  const removeParticipant = (teamIndex: number, participantIndex: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants = newTeams[teamIndex].participants.filter(
      (_, index) => index !== participantIndex
    );
    setTeams(newTeams);
  };

  const updateParticipantName = (teamIndex: number, participantIndex: number, name: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].participants[participantIndex] = name;
    setTeams(newTeams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6 md:space-y-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold px-2">Dashboard</h1>

        <TeamManagement
          teams={teams}
          onTeamAdd={addTeam}
          onTeamRemove={removeTeam}
          onTeamNameChange={updateTeamName}
          onParticipantAdd={addParticipant}
          onParticipantRemove={removeParticipant}
          onParticipantNameChange={updateParticipantName}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
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
          </div>

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