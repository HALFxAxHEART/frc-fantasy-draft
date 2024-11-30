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

const getTBAHeaders = () => {
  const apiKey = import.meta.env.VITE_TBA_API_KEY;
  if (!apiKey) {
    throw new Error('TBA API key is not configured. Please set VITE_TBA_API_KEY in your environment.');
  }
  return {
    'X-TBA-Auth-Key': apiKey,
    'Accept': 'application/json',
  };
};

export const fetchEvents = async (year: number) => {
  try {
    const response = await fetch(`${TBA_API_BASE_URL}/events/${year}/simple`, {
      headers: getTBAHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const events = await response.json() as TBAEvent[];
    return events.sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return mock data for development/fallback
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
  }
};

export const fetchEventDetails = async (eventKey: string): Promise<TBAEvent> => {
  try {
    const response = await fetch(`${TBA_API_BASE_URL}/event/${eventKey}/simple`, {
      headers: getTBAHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching event details:', error);
    // Return mock data for development/fallback
    return {
      key: eventKey,
      name: "Mock Event",
      event_code: "MOCK",
      event_type: 0,
      city: "Mock City",
      state_prov: "MC",
      start_date: "2024-03-01",
      end_date: "2024-03-03"
    };
  }
};

export const fetchEventTeams = async (eventKey: string) => {
  try {
    // Fetch basic team information
    const response = await fetch(`${TBA_API_BASE_URL}/event/${eventKey}/teams/simple`, {
      headers: getTBAHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const teams = await response.json();
    
    // Transform the data into our required format
    return teams.map((team: any) => ({
      teamNumber: team.team_number,
      teamName: team.nickname || `Team ${team.team_number}`,
      districtPoints: 0,
      stats: {
        wins: 0,
        losses: 0,
        opr: 0,
        autoAvg: 0
      }
    }));
  } catch (error) {
    console.error('Error fetching event teams:', error);
    // Return mock data for development/fallback
    return Array.from({ length: 30 }, (_, i) => ({
      teamNumber: 254 + i,
      teamName: `Team ${254 + i}`,
      districtPoints: Math.floor(Math.random() * 100),
      stats: {
        wins: Math.floor(Math.random() * 10),
        losses: Math.floor(Math.random() * 10),
        opr: Math.random() * 50,
        autoAvg: Math.random() * 10
      }
    }));
  }
};