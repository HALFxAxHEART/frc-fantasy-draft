import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TBA_API_BASE_URL = 'https://www.thebluealliance.com/api/v3';
const TBA_API_KEY = Deno.env.get('TBA_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      return new Response(
        JSON.stringify({ error: 'Either year or eventKey parameter is required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    let endpoint = '';
    if (year) {
      endpoint = `/events/${year}`;
    } else if (eventKey) {
      endpoint = `/event/${eventKey}/teams`;
    }

    console.log(`Fetching from TBA API: ${TBA_API_BASE_URL}${endpoint}`);

    const response = await fetch(`${TBA_API_BASE_URL}${endpoint}`, {
      headers: {
        'X-TBA-Auth-Key': TBA_API_KEY || '',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('TBA API Response:', data);

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
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
});