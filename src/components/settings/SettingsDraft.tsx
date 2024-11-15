import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const SettingsDraft = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Draft Settings</h2>
      <FormField
        control={form.control}
        name="draftTimeLimit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Draft Time Limit (seconds)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            </FormControl>
            <FormDescription>
              Time allowed for each pick (10-300 seconds)
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="showTeamStats"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Show Team Stats</FormLabel>
              <FormDescription>
                Display team statistics during draft
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
      <FormField
        control={form.control}
        name="autoAdvancePicks"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Auto-Advance Picks
              </FormLabel>
              <FormDescription>
                Automatically advance to next pick when time expires
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
      <FormField
        control={form.control}
        name="enableSoundEffects"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Sound Effects</FormLabel>
              <FormDescription>
                Enable sound effects during draft
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
      <FormField
        control={form.control}
        name="showTeamRankings"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Show Rankings</FormLabel>
              <FormDescription>
                Display team rankings during draft
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