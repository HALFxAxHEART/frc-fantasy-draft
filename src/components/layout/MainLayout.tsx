import { Outlet, useNavigate, Link } from "react-router-dom";
import { Footer } from "../Footer";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Bug, LogOut, Mail, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ProfilePicture } from "../ProfilePicture";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export const MainLayout = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);

      // Fetch user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, profile_picture_url')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name || '');
        setProfilePicture(profile.profile_picture_url);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEmailBug = () => {
    window.location.href = `mailto:support@example.com?subject=Bug%20Report&body=Please%20describe%20the%20bug%20you%20encountered:`;
  };

  const handleGithubBug = () => {
    window.open('https://github.com/your-repo/issues/new', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold">FRC Fantasy Draft</span>
          </Link>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Bug className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report a Bug</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleEmailBug}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Report via Email
                  </Button>
                  <Button
                    onClick={handleGithubBug}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    Create GitHub Issue
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-0">
                    <ProfilePicture
                      userId={user.id}
                      displayName={displayName}
                      currentUrl={profilePicture || undefined}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>

      <main className="container py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};