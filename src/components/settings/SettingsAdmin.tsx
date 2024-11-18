import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SettingsAdmin = () => {
  const [userId, setUserId] = useState("");
  const { toast } = useToast();

  const handleMakeAdmin = async () => {
    try {
      // Validate UUID format
      if (!userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        throw new Error("Invalid user ID format");
      }

      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User has been made an admin",
      });
      
      setUserId("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Admin Settings</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">User ID</label>
          <div className="flex gap-2">
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="flex-1"
            />
            <Button onClick={handleMakeAdmin}>
              Make Admin
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the UUID of the user you want to make an admin
          </p>
        </div>
      </div>
    </div>
  );
};