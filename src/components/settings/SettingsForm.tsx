import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { SettingsProfile } from "./SettingsProfile";
import { SettingsDraft } from "./SettingsDraft";
import { SettingsAppearance } from "./SettingsAppearance";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const settingsSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  draftTimeLimit: z.number().min(10).max(300),
  showTeamStats: z.boolean(),
  enableSoundEffects: z.boolean(),
  showTeamRankings: z.boolean(),
  autoAdvancePicks: z.boolean(),
  darkMode: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export const SettingsForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: "",
      email: "",
      draftTimeLimit: 60,
      showTeamStats: true,
      enableSoundEffects: true,
      showTeamRankings: true,
      autoAdvancePicks: true, // Changed to true by default
      darkMode: document.documentElement.classList.contains('dark'),
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: data.displayName })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      if (data.email !== session.user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        });
        if (emailError) throw emailError;
      }

      localStorage.setItem('darkMode', data.darkMode.toString());
      document.documentElement.classList.toggle('dark', data.darkMode);

      localStorage.setItem("draftSettings", JSON.stringify({
        draftTimeLimit: data.draftTimeLimit,
        showTeamStats: data.showTeamStats,
        enableSoundEffects: data.enableSoundEffects,
        showTeamRankings: data.showTeamRankings,
        autoAdvancePicks: data.autoAdvancePicks,
      }));

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SettingsProfile form={form} />
        <SettingsDraft form={form} />
        <SettingsAppearance form={form} />
        <Button type="submit" className="w-full">Save Settings</Button>
      </form>
    </Form>
  );
};