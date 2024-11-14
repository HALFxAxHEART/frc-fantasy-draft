import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const UserHeader = ({ displayName }: { displayName: string }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to true
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if dark mode preference exists in localStorage
    const storedPreference = localStorage.getItem("darkMode");
    // If no preference is stored, default to dark mode
    const shouldBeDark = storedPreference === null ? true : storedPreference === "true";
    setIsDarkMode(shouldBeDark);
    
    // Apply dark mode class if needed
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark");
    toast({
      title: `${newDarkMode ? 'Dark' : 'Light'} mode enabled`,
      duration: 1500,
    });
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
            aria-label="Toggle dark mode"
          />
          <Moon className="h-4 w-4" />
        </div>
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
  );
};