import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface DraftErrorStateProps {
  title: string;
  message: string;
}

export const DraftErrorState = ({ title, message }: DraftErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
        <Button onClick={() => navigate('/dashboard')} variant="default">
          Return to Dashboard
        </Button>
      </div>
    </Card>
  );
};