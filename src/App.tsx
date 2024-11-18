import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Footer } from "./components/Footer";
import { SupportTicketButton } from "./components/SupportTicketButton";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Draft from "./pages/Draft";
import Settings from "./pages/Settings";
import Results from "./pages/Results";
import GlobalDrafts from "./pages/GlobalDrafts";
import DraftSelection from "./pages/DraftSelection";
import { useEffect, useState } from "react";
import { Moon, Sun, Settings as SettingsIcon, LogOut } from "lucide-react";
import { Button } from "./components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "./components/ui/use-toast";
import { ProfilePicture } from "@/components/ProfilePicture";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, profile_picture_url, is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setDisplayName(profile.display_name);
          setProfilePicture(profile.profile_picture_url);
          setUserId(session.user.id);
        }
      }
    };

    fetchUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setDisplayName(null);
        setProfilePicture(null);
        setUserId(null);
        navigate('/login');
      } else if (event === 'SIGNED_IN') {
        fetchUserProfile();
        navigate('/select-draft');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const handleProfilePictureUpdate = (newUrl: string) => {
    setProfilePicture(newUrl);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 right-0 z-50 flex items-center gap-2 p-4 w-full md:w-auto md:top-4 md:right-4 bg-background/80 backdrop-blur-sm md:bg-transparent">
        <div className="flex-1 md:hidden">
          {/* Mobile title */}
          <h1 className="text-lg font-semibold">FRC Fantasy</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
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
              {userId && displayName && (
                <ProfilePicture
                  userId={userId}
                  displayName={displayName}
                  currentUrl={profilePicture || undefined}
                  onUpdate={handleProfilePictureUpdate}
                />
              )}
              <span className="hidden md:inline">{displayName || 'Profile'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="pt-16 md:pt-0">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-draft" element={<DraftSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/draft/:draftId" element={<Draft />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/results/:draftId" element={<Results />} />
          <Route path="/global-drafts" element={<GlobalDrafts />} />
        </Routes>
      </div>
      <Footer />
      <SupportTicketButton />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;