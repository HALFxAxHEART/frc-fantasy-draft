import { Loader2 } from "lucide-react";

export const DraftLoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="text-lg text-muted-foreground">Loading draft data...</p>
      </div>
    </div>
  );
};