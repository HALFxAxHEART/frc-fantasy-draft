import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const SettingsButton = () => {
  return (
    <Link to="/settings">
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-20 z-50 rounded-full shadow-lg bg-background hover:bg-accent"
      >
        <Settings className="h-5 w-5" />
      </Button>
    </Link>
  );
};