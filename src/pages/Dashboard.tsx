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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [teams, setTeams] = useState<Array<{ name: string; participants: string[] }>>([]);
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

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Create Teams</h2>
              <div className="space-y-6">
                {teams.map((team, teamIndex) => (
                  <Card key={teamIndex} className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <label className="block text-sm font-medium mb-1">
                          Team Name
                        </label>
                        <Input
                          value={team.name}
                          onChange={(e) => updateTeamName(teamIndex, e.target.value)}
                          placeholder={`Team ${teamIndex + 1}`}
                        />
                      </div>
                      {teams.length > 1 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeTeam(teamIndex)}
                          className="mt-6"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {team.participants.map((participant, participantIndex) => (
                        <div key={participantIndex} className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input
                              value={participant}
                              onChange={(e) =>
                                updateParticipantName(
                                  teamIndex,
                                  participantIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Participant ${participantIndex + 1}`}
                            />
                          </div>
                          {team.participants.length > 1 && (
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                removeParticipant(teamIndex, participantIndex)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {team.participants.length < 5 && (
                        <Button
                          variant="outline"
                          onClick={() => addParticipant(teamIndex)}
                          className="w-full"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Add Participant
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
                {teams.length < 10 && (
                  <Button
                    variant="outline"
                    onClick={addTeam}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team
                  </Button>
                )}
              </div>
            </Card>

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