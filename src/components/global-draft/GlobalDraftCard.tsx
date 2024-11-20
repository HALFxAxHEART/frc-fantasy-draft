import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Trash2, UserMinus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GlobalDraftCardProps {
  draft: {
    id: string;
    name: string | null;
    season_year: number;
    start_date: string;
    end_date: string;
    status: string;
    settings: {
      eventType: string;
    };
  };
  onJoin: (draftId: string) => void;
  isAdmin?: boolean;
}

export const GlobalDraftCard = ({ draft, onJoin, isAdmin = false }: GlobalDraftCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('global_drafts')
        .delete()
        .eq('id', draft.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Draft deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold">{draft.name || `Season ${draft.season_year} Draft`}</h3>
          <p className="text-muted-foreground">
            {format(new Date(draft.start_date), "PPP")} - {format(new Date(draft.end_date), "PPP")}
          </p>
        </div>
        <div>
          <p>Status: {draft.status}</p>
          <p>Event Type: {draft.settings?.eventType || "All Events"}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onJoin(draft.id)}>Join Draft</Button>
          <Button variant="outline" onClick={() => navigate(`/global-drafts/${draft.id}`)}>
            View Draft
          </Button>
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this draft? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </Card>
  );
};