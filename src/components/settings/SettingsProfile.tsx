import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const SettingsProfile = ({ form }: { form: UseFormReturn<any> }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, profile_picture_url')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setDisplayName(profile.display_name);
          setProfilePicture(profile.profile_picture_url);
          setUserId(session.user.id);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Profile Settings</h2>
      
      {userId && displayName && (
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
          <h3 className="text-md font-medium">Profile Picture</h3>
          <ProfilePicture
            userId={userId}
            displayName={displayName}
            currentUrl={profilePicture || undefined}
          />
          <p className="text-sm text-muted-foreground">
            Click on your profile picture to update it
          </p>
        </div>
      )}

      <FormField
        control={form.control}
        name="displayName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};