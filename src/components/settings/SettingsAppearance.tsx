import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

export const SettingsAppearance = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Appearance Settings</h2>
      <FormField
        control={form.control}
        name="darkMode"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Dark Mode</FormLabel>
              <FormDescription>
                Enable dark mode theme
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};