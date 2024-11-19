import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "support" | "feature";
  subject: string;
  description: string;
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const emailRequest: EmailRequest = await req.json();
    
    // Get user information if userId is provided
    let userInfo = "";
    if (emailRequest.userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', emailRequest.userId)
        .single();
      
      if (profile) {
        userInfo = `\nSubmitted by: ${profile.display_name}`;
      }
    }

    const emailContent = `
      Type: ${emailRequest.type === "support" ? "Support Ticket" : "Feature Request"}
      Subject: ${emailRequest.subject}
      Description: ${emailRequest.description}
      ${userInfo}
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "FRC Fantasy Draft <notifications@frcfantasy.com>",
        to: [ADMIN_EMAIL!],
        subject: `[${emailRequest.type.toUpperCase()}] ${emailRequest.subject}`,
        text: emailContent,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);