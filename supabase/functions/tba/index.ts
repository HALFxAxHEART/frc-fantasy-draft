import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TBA_BASE_URL = 'https://www.thebluealliance.com/api/v3';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const year = url.searchParams.get('year');
    const eventKey = url.searchParams.get('eventKey');

    if (!year && !eventKey) {
      throw new Error('Either year or eventKey parameter is required');
    }

    const TBA_API_KEY = Deno.env.get('TBA_API_KEY');
    if (!TBA_API_KEY) {
      throw new Error('TBA API key is not configured');
    }

    let endpoint = '';
    if (year) {
      endpoint = `/events/${year}`;
      console.log(`Fetching events for year ${year}`);
    } else if (eventKey) {
      endpoint = `/event/${eventKey}/teams`;
      console.log(`Fetching teams for event ${eventKey}`);
    }

    const response = await fetch(`${TBA_BASE_URL}${endpoint}`, {
      headers: {
        'X-TBA-Auth-Key': TBA_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`TBA API responded with status: ${response.status}`);
      throw new Error(`TBA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );

  } catch (error) {
    console.error('Error in TBA function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
})