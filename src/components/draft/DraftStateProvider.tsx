import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Team, DraftParticipant } from "@/types/draft";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DraftState {
  participants: DraftParticipant[];
  selectedEvent: string;
  currentParticipantIndex: number;
  timeRemaining: number;
  draftComplete: boolean;
  draftStarted: boolean;
}

interface DraftStateContextType {
  draftState: DraftState;
  setDraftState: React.Dispatch<React.SetStateAction<DraftState>>;
}

const DraftStateContext = createContext<DraftStateContextType | undefined>(undefined);

export const useDraftState = () => {
  const context = useContext(DraftStateContext);
  if (!context) {
    throw new Error("useDraftState must be used within a DraftStateProvider");
  }
  return context;
};

export const DraftStateProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const draftId = location.pathname.split('/').pop();
  
  const [draftState, setDraftState] = useState<DraftState>(() => ({
    participants: [],
    selectedEvent: "",
    currentParticipantIndex: 0,
    timeRemaining: 120,
    draftComplete: false,
    draftStarted: false,
  }));

  useEffect(() => {
    const fetchDraftData = async () => {
      if (!draftId) return;

      try {
        const { data: draft, error } = await supabase
          .from('drafts')
          .select('*')
          .eq('id', draftId)
          .single();

        if (error) throw error;

        if (!draft) {
          toast({
            title: "Error",
            description: "Draft not found",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        // Ensure participants is an array and has the correct shape
        const participants = Array.isArray(draft.participants) 
          ? draft.participants.map((participant: any) => ({
              name: participant.name || '',
              teams: Array.isArray(participant.teams) ? participant.teams : [],
            }))
          : [];

        setDraftState(prev => ({
          ...prev,
          participants,
          selectedEvent: draft.event_key || "",
        }));

      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load draft data",
          variant: "destructive",
        });
        console.error('Error loading draft:', error);
      }
    };

    fetchDraftData();
  }, [draftId, navigate, toast]);

  return (
    <DraftStateContext.Provider value={{ draftState, setDraftState }}>
      {children}
    </DraftStateContext.Provider>
  );
};