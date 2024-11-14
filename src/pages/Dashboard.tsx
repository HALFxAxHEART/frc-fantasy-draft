import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/tba-api";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Moon, Sun, Settings, LogOut, User } from "lucide-react";
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
                  {/* Replace with actual user display name */}
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