const TBA_API_BASE_URL = 'https://www.thebluealliance.com/api/v3';

export interface TBAEvent {
  key: string;
  name: string;
  event_code: string;
  event_type: number;
  district?: {
    abbreviation: string;
    display_name: string;
    key: string;
    year: number;
  };
  city: string;
  state_prov: string;
  start_date: string;
  end_date: string;
}

export const fetchEvents = async (year: number) => {
  const apiKey = import.meta.env.VITE_TBA_API_KEY;
  
  if (!apiKey) {
    throw new Error('TBA API key is not configured. Please set VITE_TBA_API_KEY in your environment.');
  }

  try {
    const response = await fetch(`${TBA_API_BASE_URL}/events/${year}`, {
      headers: {
        'X-TBA-Auth-Key': apiKey,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}\n${errorText}`);
    }
    
    return response.json() as Promise<TBAEvent[]>;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events. Please check your API key and try again.');
  }
};