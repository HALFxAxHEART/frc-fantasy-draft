import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/tba-api";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { DraftCreation } from "@/components/DraftCreation";
import { EventSelector } from "@/components/EventSelector";
import { DraftStats } from "@/components/DraftStats";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Dashboard = () => {
  const [participants, setParticipants] = useState(2);
  const [participantNames, setParticipantNames] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [userDrafts, setUserDrafts] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events', selectedYear],
    queryFn: () => fetchEvents(selectedYear),
  });

  useEffect(() => {
    setParticipantNames(Array(participants).fill(""));
  }, [participants]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      fetchUserDrafts(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const fetchUserDrafts = async (userId: string) => {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your drafts",
        variant: "destructive",
      });
      return;
    }

    setUserDrafts(data || []);
  };

  const handleStartDraft = async () => {
    if (participantNames.some(name => !name.trim())) {
      toast({
        title: "Error",
        description: "All participants must have names",
        variant: "destructive",
      });
      return;
    }

    if (!selectedEvent) {
      toast({
        title: "Error",
        description: "Please select an event",
        variant: "destructive",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Error",
        description: "Please sign in to create a draft",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('drafts')
      .insert({
        user_id: session.user.id,
        event_key: selectedEvent,
        event_name: events?.find(e => e.key === selectedEvent)?.name || selectedEvent,
        status: 'active',
        participants: participantNames.map(name => ({ name, teams: [] })),
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create draft",
        variant: "destructive",
      });
      return;
    }

    navigate("/draft", {
      state: {
        draftId: data.id,
        participants: participantNames,
        selectedEvent,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

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
              onStartDraft={handleStartDraft}
            />
            
            <EventSelector
              events={events}
              selectedEvent={selectedEvent}
              onEventChange={setSelectedEvent}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              selectedDistrict={selectedDistrict}
              onDistrictChange={setSelectedDistrict}
              isLoading={isLoading}
              error={error instanceof Error ? error : null}
            />
          </div>

          <div className="space-y-8">
            {userDrafts.length > 0 && (
              <DraftStats
                participants={userDrafts.flatMap(draft => 
                  draft.participants.map((p: any) => ({
                    name: p.name,
                    teams: p.teams || [],
                  }))
                )}
              />
            )}
            <UpcomingEvents
              events={events}
              onEventSelect={setSelectedEvent}
              isLoading={isLoading}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;