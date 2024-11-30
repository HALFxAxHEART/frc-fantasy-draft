import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { EventSelector } from "@/components/EventSelector";
import { supabase } from "@/integrations/supabase/client";
import { DraftCreation } from "@/components/DraftCreation";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { fetchEventTeams } from "@/services/tbaService";

interface DraftCreationSectionProps {
  userId: string;
  events: any[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  selectedEvent: string;
  onEventChange: (event: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export const DraftCreationSection = ({
  userId,
  events,
  selectedYear,
  onYearChange,
  selectedDistrict,
  onDistrictChange,
  selectedEvent,
  onEventChange,
  isLoading,
  error
}: DraftCreationSectionProps) => {
  const [nickname, setNickname] = useState("");
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Error",
            description: "Please log in to create drafts.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          toast({
            title: "Error",
            description: "Profile not found. Please try logging out and back in.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to check profile. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (userId) {
      checkProfile();
    }
  }, [userId, toast, navigate]);

  const handleStartDraft = async () => {
    if (!selectedEvent) {
      toast({
        title: "Error",
        description: "Please select an event",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingTeams(true);
      const teams = await fetchEventTeams(selectedEvent);
      let progress = 0;
      const increment = 100 / teams.length;
      
      teams.forEach((team, index) => {
        progress += increment;
        setLoadingProgress(Math.min(Math.round(progress), 100));
        console.log(`Loaded team ${team.teamNumber}: ${team.teamName}`);
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "Please log in to create drafts.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data, error: draftError } = await supabase
        .from('drafts')
        .insert({
          user_id: userId,
          event_key: selectedEvent,
          event_name: events?.find(e => e.key === selectedEvent)?.name || selectedEvent,
          status: 'active',
          nickname: nickname || null,
        })
        .select()
        .single();

      if (draftError) throw draftError;

      navigate(`/draft/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create draft. Please try again.",
        variant: "destructive",
      });
      console.error('Draft creation error:', error);
    } finally {
      setLoadingTeams(false);
      setLoadingProgress(0);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Draft</h2>
        <Separator className="my-4" />
        <div className="space-y-6">
          <DraftCreation
            onStartDraft={handleStartDraft}
            nickname={nickname}
            onNicknameChange={setNickname}
          />
          
          <EventSelector
            events={events}
            selectedEvent={selectedEvent}
            onEventChange={onEventChange}
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            selectedDistrict={selectedDistrict}
            onDistrictChange={onDistrictChange}
            isLoading={isLoading}
            error={error}
          />

          {loadingTeams && (
            <div className="space-y-2">
              <Progress value={loadingProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Loading teams: {loadingProgress}%
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};