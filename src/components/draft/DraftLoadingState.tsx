import { Progress } from "@/components/ui/progress";
import { DraftLoadingIndicator } from "./DraftLoadingIndicator";

interface DraftLoadingStateProps {
  isLoadingDraft: boolean;
  isLoadingTeams: boolean;
  loadingProgress: number;
  teamsLoaded?: number;
  totalTeams?: number;
}

export const DraftLoadingState = ({
  isLoadingDraft,
  isLoadingTeams,
  loadingProgress,
  teamsLoaded = 0,
  totalTeams = 0
}: DraftLoadingStateProps) => {
  return (
    <div className="space-y-4">
      <DraftLoadingIndicator 
        message={isLoadingDraft ? "Loading draft data..." : "Loading participants..."}
      />
      {(isLoadingDraft || isLoadingTeams) && (
        <div className="w-full max-w-md mx-auto space-y-2">
          <Progress value={loadingProgress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">
            Loading progress: {loadingProgress}% 
            {isLoadingTeams && ` (${teamsLoaded}/${totalTeams} teams)`}
          </p>
        </div>
      )}
    </div>
  );
};