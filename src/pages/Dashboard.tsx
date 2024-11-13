import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents, type TBAEvent } from "@/lib/tba-api";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [participants, setParticipants] = useState(2);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  
  const currentYear = new Date().getFullYear();
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events', currentYear],
    queryFn: () => fetchEvents(currentYear),
  });

  useEffect(() => {
    // Initialize dark mode from system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: `${isDarkMode ? 'Light' : 'Dark'} mode enabled`,
      duration: 1500,
    });
  };

  return (
    <div className="min-h-screen bg-muted dark:bg-secondary p-8 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-secondary dark:text-white">Dashboard</h1>
          <div className="flex gap-4">
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
            <Button variant="outline" onClick={() => {}}>
              Sign Out
            </Button>
          </div>
        </div>

        <Card className="p-6 space-y-6 dark:bg-secondary/50">
          <h2 className="text-2xl font-semibold text-secondary dark:text-white">
            Create New Draft
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Participants
              </label>
              <Input
                type="number"
                min="2"
                max="10"
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                className="w-full max-w-xs dark:bg-secondary/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Event
              </label>
              <Select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full"
              >
                <option value="">Select an event...</option>
                {events?.map((event) => (
                  <option key={event.key} value={event.key}>
                    {event.name} ({event.city}, {event.state_prov})
                  </option>
                ))}
              </Select>
              {isLoading && <p className="text-sm text-gray-500">Loading events...</p>}
              {error && <p className="text-sm text-red-500">Error loading events</p>}
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
              onClick={() => {}}
            >
              Start Draft
            </Button>
          </div>
        </Card>

        <Card className="p-6 dark:bg-secondary/50">
          <h2 className="text-2xl font-semibold text-secondary dark:text-white mb-4">
            Previous Drafts
          </h2>
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            No previous drafts found
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;