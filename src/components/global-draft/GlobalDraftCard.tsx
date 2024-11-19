import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

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
}

export const GlobalDraftCard = ({ draft, onJoin }: GlobalDraftCardProps) => {
  const navigate = useNavigate();

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
        </div>
      </div>
    </Card>
  );
};