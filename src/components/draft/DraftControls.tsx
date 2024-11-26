import { useToast } from "@/components/ui/use-toast";
import { useDraftState } from "./DraftStateProvider";

export const DraftControls = () => {
  const { draftState, setDraftState } = useDraftState();
  const { toast } = useToast();

  const startDraft = () => {
    if (!draftState.teams.length) {
      toast({
        title: "Error",
        description: "No teams found. Please return to dashboard and try again.",
        variant: "destructive",
      });
      return;
    }

    setDraftState((prev) => ({
      ...prev,
      draftStarted: true,
    }));
    
    toast({
      title: "Draft Started",
      description: `${draftState.teams[0].name}'s turn to pick`,
    });
  };

  return { startDraft };
};