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
    // First try direct API call
    try {
      const response = await fetch(`${TBA_API_BASE_URL}/events/${year}`, {
        headers: {
          'X-TBA-Auth-Key': apiKey,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        return response.json() as Promise<TBAEvent[]>;
      }
    } catch (directError) {
      console.warn('Direct API call failed, falling back to mock data:', directError);
    }

    // Fallback to mock data for development
    console.info('Using mock event data for development');
    return [
      {
        key: "2024mock1",
        name: "Mock Regional 1",
        event_code: "MOCK1",
        event_type: 0,
        district: {
          abbreviation: "PNW",
          display_name: "Pacific Northwest",
          key: "pnw",
          year: 2024
        },
        city: "Seattle",
        state_prov: "WA",
        start_date: "2024-03-01",
        end_date: "2024-03-03"
      },
      {
        key: "2024mock2",
        name: "Mock Regional 2",
        event_code: "MOCK2",
        event_type: 0,
        city: "Portland",
        state_prov: "OR",
        start_date: "2024-03-08",
        end_date: "2024-03-10"
      }
    ];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events. Please check your API key and try again.');
  }
};