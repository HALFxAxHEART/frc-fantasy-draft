import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface DraftCreationProps {
  participants: number;
  participantNames: string[];
  onParticipantsChange: (value: number) => void;
  onParticipantNameChange: (index: number, value: string) => void;
  onStartDraft: () => void;
}

export const DraftCreation = ({
  participants,
  participantNames,
  onParticipantsChange,
  onParticipantNameChange,
  onStartDraft,
}: DraftCreationProps) => {
  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Create New Draft</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Participants
          </label>
          <Input
            type="number"
            min="2"
            max="10"
            value={participants}
            onChange={(e) => onParticipantsChange(Number(e.target.value))}
            className="w-full max-w-xs"
          />
        </div>Certainly! I'll create a settings page and update the dashboard to improve the draft creation process. Let's implement these changes step by step.

<lov-code>
First, let's create a new Settings page:

<lov-write file_path="src/pages/Settings.tsx">
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [displayName, setDisplayName] = useState('');
  const [draftDuration, setDraftDuration] = useState(120);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      if (data) setDisplayName(data.display_name);
      if (error) console.error('Error fetching user profile:', error);
    }
  };

  const handleSaveSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Settings updated successfully",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Draft Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="draftDuration">Default Draft Duration (seconds)</Label>
                <Input
                  id="draftDuration"
                  type="number"
                  value={draftDuration}
                  onChange={(e) => setDraftDuration(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;