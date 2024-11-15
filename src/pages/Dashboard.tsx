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
import { EventSelector } from "@/components/EventSelector";
import { DraftStats } from "@/components/DraftStats";
import { supabase } from "@/integrations/supabase/client";
import { UserDrafts } from "@/components/dashboard/UserDrafts";
import { DraftControls } from "@/components/dashboard/DraftControls";
import { DraftCreationSection } from "@/components/dashboard/DraftCreationSection";

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState("");
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
          {userId && (
            <DraftCreationSection
              userId={userId}
              events={events}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              selectedDistrict={selectedDistrict}
              onDistrictChange={setSelectedDistrict}
              isLoading={isLoading}
              error={error instanceof Error ? error : null}
            />
          )}

          <div className="space-y-8">
            {userId && <UserDrafts userId={userId} />}
            <UpcomingEvents
              events={events}
              isLoading={isLoading}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;