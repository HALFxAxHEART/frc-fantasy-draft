import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Draft {
  id: string;
  event_name: string;
  created_at: string;
}

export const DraftsList = ({ drafts, isLoading }: { drafts: Draft[], isLoading: boolean }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading drafts...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Drafts</CardTitle>
        <CardDescription>Manage your existing drafts</CardDescription>
      </CardHeader>
      <CardContent>
        {drafts?.length ? (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{draft.event_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created on {new Date(draft.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate(`/draft/${draft.id}`)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No drafts yet</p>
        )}
      </CardContent>
    </Card>
  );
};