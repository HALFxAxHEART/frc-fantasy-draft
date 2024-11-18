import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Check } from "lucide-react";

interface DraftSharingProps {
  shareCode: string;
}

export const DraftSharing = ({ shareCode }: DraftSharingProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/draft/${shareCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Share Draft</label>
      <div className="flex gap-2">
        <Input
          value={shareUrl}
          readOnly
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};