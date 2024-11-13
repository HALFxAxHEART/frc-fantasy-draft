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
  const response = await fetch(`${TBA_API_BASE_URL}/events/${year}`, {
    headers: {
      'X-TBA-Auth-Key': import.meta.env.VITE_TBA_API_KEY || '',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  
  return response.json() as Promise<TBAEvent[]>;
};