import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DraftLoadingErrorProps {
  error: string;
}

export const DraftLoadingError = ({ error }: DraftLoadingErrorProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <p className="text-lg text-red-600">{error}</p>
        <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        <Link to="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};