import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/tba-api";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Moon, Sun, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { EventSelector } from "@/components/EventSelector";
import { DraftCreation } from "@/components/DraftCreation";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [participants, setParticipants] = useState(2);
  const [participantNames, setParticipantNames] = useState(["", ""]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setDisplayName(profile.display_name);
        }
      }
    };

    getUserProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: `${isDarkMode ? 'Light' : 'Dark'} mode enabled`,
      duration: 1500,
    });
  };

  const handleStartDraft = () => {
    if (!selectedEvent) {
      toast({
        title: "Error",
        description: "Please select an event",
        variant: "destructive",
      });
      return;
    }

    if (participantNames.some(name => !name.trim())) {
      toast({
        title: "Error",
        description: "Please enter names for all participants",
        variant: "destructive",
      });
      return;
    }

    navigate('/draft', { state: { participants: participantNames, selectedEvent } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  {displayName || "User"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/settings')}>
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

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Create New Draft */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Draft</CardTitle>
                <CardDescription>Start a new fantasy draft for an FRC event</CardDescription>
              </CardHeader>
              <CardContent>
                <EventSelector
                  events={events}
                  selectedEvent={selectedEvent}
                  onEventChange={setSelectedEvent}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  selectedDistrict={selectedDistrict}
                  onDistrictChange={setSelectedDistrict}
                  isLoading={eventsLoading}
                />
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
              </CardContent>
            </Card>

            {/* Your Drafts */}
            <Card>
              <CardHeader>
                <CardTitle>Your Drafts</CardTitle>
                <CardDescription>Manage your existing drafts</CardDescription>
              </CardHeader>
              <CardContent>
                {draftsLoading ? (
                  <p>Loading drafts...</p>
                ) : userDrafts?.length ? (
                  <div className="space-y-4">
                    {userDrafts.map((draft: any) => (
                      <div
                        key={draft.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div>
                          <h3 className="font-medium">{draft.event_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created on {new Date(draft.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" onClick={() => navigate(`/draft/${draft.id}`)}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No drafts yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Browse upcoming FRC events</CardDescription>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <p>Loading events...</p>
                ) : events?.length ? (
                  <div className="space-y-4">
                    {events.slice(0, 5).map((event: any) => (
                      <div
                        key={event.key}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div>
                          <h3 className="font-medium">{event.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" onClick={() => setSelectedEvent(event.key)}>
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No upcoming events</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
