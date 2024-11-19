import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on index page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      className="mb-4"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
};