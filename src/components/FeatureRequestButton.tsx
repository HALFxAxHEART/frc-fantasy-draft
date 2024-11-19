import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lightbulb } from "lucide-react";

export const FeatureRequestButton = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a feature request",
          variant: "destructive",
        });
        return;
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: "feature",
          subject,
          description,
          userId: session.user.id,
        },
      });

      if (emailError) throw emailError;

      toast({
        title: "Success",
        description: "Your feature request has been submitted",
      });

      setSubject("");
      setDescription("");
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-20 right-4 rounded-full">
          <Lightbulb className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Feature Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Feature Title"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Feature Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};