// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://rdgtfutmiucxdhbiizxy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZ3RmdXRtaXVjeGRoYmlpenh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1OTU3MjAsImV4cCI6MjA0NzE3MTcyMH0.vftA3TTJlOTaatgjnCnQLjqBnrRMnkIab7CiHDQZcGE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);