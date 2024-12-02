import { Outlet, useNavigate, Link } from "react-router-dom";
import { Footer } from "../Footer";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Bug, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ProfilePicture } from "../ProfilePicture";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      subject: "",
      description: "",
    },
  });

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

  const onSubmitBugReport = async (data: any) => {
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

      form.reset();
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitBugReport)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Brief description of the issue" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Please provide details about the bug"
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </form>
                </Form>
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
                      onUpdate={(url) => setProfilePicture(url)}
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