import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const ProfilePicture = ({ userId, displayName, currentUrl, onUpdate }: { 
  userId: string;
  displayName: string;
  currentUrl?: string;
  onUpdate?: (newUrl: string) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const { toast } = useToast();

  const deleteOldProfilePicture = async (oldUrl: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = oldUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Gets "userId/filename"

      await supabase.storage
        .from('profile_pictures')
        .remove([filePath]);
    } catch (error) {
      console.error('Error deleting old profile picture:', error);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);

      // If there's an existing profile picture, delete it
      if (previewUrl) {
        await deleteOldProfilePicture(previewUrl);
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      setPreviewUrl(publicUrl);
      if (onUpdate) onUpdate(publicUrl);

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto">
          <Avatar className="h-8 w-8">
            <AvatarImage src={previewUrl} />
            <AvatarFallback>{displayName?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewUrl} />
              <AvatarFallback>{displayName?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadProfilePicture(file);
            }}
            disabled={isUploading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};