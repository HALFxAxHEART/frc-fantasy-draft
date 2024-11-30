import { serve } from "https://deno.fresh.run/std@0.168.0/http/server.ts"

const TBA_API_BASE_URL = 'https://www.thebluealliance.com/api/v3';
const TBA_API_KEY = Deno.env.get('TBA_API_KEY');

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const year = url.searchParams.get('year');
    const eventKey = url.searchParams.get('eventKey');

    if (!year && !eventKey) {
      return new Response(
        JSON.stringify({ error: 'Either year or eventKey parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let endpoint = '';
    if (year) {
      endpoint = `/events/${year}`;
    } else if (eventKey) {
      endpoint = `/event/${eventKey}/teams`;
    }

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

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
})