import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { DraftStats } from "./DraftStats";
import { BroadcastData } from "./BroadcastData";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DraftResultsProps {
  draftId: string;
  participants: Array<{
    name: string;
    teams: Array<{
      teamNumber: number;
      teamName: string;
      stats?: {
        wins: number;
        losses: number;
        opr?: number;
        autoAvg?: number;
        ranking?: number;
      };
    }>;
  }>;
  eventName: string;
}

export const DraftResults = ({ draftId, participants, eventName }: DraftResultsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFinalizeDraft = async () => {
    try {
      const { error } = await supabase
        .from('drafts')
        .update({ status: 'completed' })
        .eq('id', draftId);

      if (error) throw error;

      toast({
        title: "Draft Finalized",
        description: "Draft results have been saved successfully.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to finalize draft results.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold text-center">Draft Results</h1>
        
        <DraftStats participants={participants} />
        
        <BroadcastData 
          eventName={eventName}
          participants={participants}
        />

        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
          <Button onClick={handleFinalizeDraft} variant="default">
            Finalize Results
          </Button>
        </div>
      </motion.div>
    </div>
  );
};