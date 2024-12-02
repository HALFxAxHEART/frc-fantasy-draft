import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Footer } from "../Footer";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { NavBar } from "./NavBar";
import { BugReportDialog } from "./BugReportDialog";

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Only redirect to login if not on the index page and not authenticated
      if (!session && location.pathname !== '/') {
        navigate('/login');
        return;
      }
      
      if (session) {
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
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && location.pathname !== '/') {
        navigate('/login');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

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

  const handleBugReport = async (data: any) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: data.subject,
          description: data.description,
        });

      if (error) throw error;

      toast({
        title: "Bug Report Submitted",
        description: "Thank you for your feedback. We'll look into this issue.",
      });

      setIsBugReportOpen(false);
    } catch (error: any) {
      toast({
        title: "Error submitting bug report",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-primary/20 to-background">
      <NavBar
        user={user}
        displayName={displayName}
        profilePicture={profilePicture}
        onProfileUpdate={(url) => setProfilePicture(url)}
        onSignOut={handleSignOut}
        onBugReport={() => setIsBugReportOpen(true)}
      />

      <BugReportDialog
        isOpen={isBugReportOpen}
        onClose={() => setIsBugReportOpen(false)}
        onSubmit={handleBugReport}
        isSubmitting={isSubmitting}
      />

      <main className="flex-1 container py-6 overflow-auto">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
