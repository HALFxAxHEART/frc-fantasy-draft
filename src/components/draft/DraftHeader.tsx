import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DraftHeaderProps {
  nickname?: string;
  eventName: string;
}

export const DraftHeader = ({ nickname, eventName }: DraftHeaderProps) => {
  return (
    <h1 className="text-3xl font-bold">
      {nickname ? `${nickname} - ${eventName}` : eventName}
    </h1>
  );
};