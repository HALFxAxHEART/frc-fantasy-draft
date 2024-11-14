import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Settings, LogOut, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/tba-api";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { EventSelector } from "@/components/EventSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [participants, setParticipants] = useState(2);
  const [participantNames, setParticipantNames] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events', selectedYear],
    queryFn: () => fetchEvents(selectedYear),
  });

  const upcomingEvents = events?.slice(0, 5) || [];

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    setParticipantNames(Array(participants).fill(""));
  }, [participants]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: `${isDarkMode ? 'Light' : 'Dark'} mode enabled`,
      duration: 1500,
    });
  };

  const handleStartDraft = () => {
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

    const shuffledParticipants = [...participantNames]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    navigate("/draft", {
      state: {
        participants: shuffledParticipants,
        selectedEvent,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background p-8 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
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
                  John Doe
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Create New Draft</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of Participants
                </label>
                <Input
                  type="number"
                  min="2"
                  max="10"
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                  className="w-full max-w-xs"
                />
              </div>

              <div className="space-y-4">
                {participantNames.map((name, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-1">
                      Participant {index + 1} Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => {
                        const newNames = [...participantNames];
                        newNames[index] = e.target.value;
                        setParticipantNames(newNames);
                      }}
                      className="w-full max-w-xs"
                    />
                  </div>
                ))}
              </div>

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

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
                onClick={handleStartDraft}
              >
                Start Draft
              </Button>
            </div>
          </Card>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.city}, {event.state_prov}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedEvent(event.key)}>
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Your Drafts</h2>
              <div className="text-center text-muted-foreground py-8">
                No active drafts
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;