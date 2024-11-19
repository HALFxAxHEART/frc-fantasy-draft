import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const GlobalDraftHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};