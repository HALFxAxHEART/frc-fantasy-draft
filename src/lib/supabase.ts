import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  display_name: string;
  created_at: string;
};

export type Draft = {
  id: string;
  created_by: string;
  event_key: string;
  event_name: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  ends_at: string;
  pick_time_seconds: number;
};

export type DraftParticipant = {
  id: string;
  draft_id: string;
  user_id: string;
  display_name: string;
  draft_position: number;
};

export type DraftPick = {
  id: string;
  draft_id: string;
  participant_id: string;
  team_key: string;
  team_number: number;
  team_name: string;
  pick_number: number;
  picked_at: string;
};