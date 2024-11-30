const TBA_API_KEY = import.meta.env.VITE_TBA_API_KEY;
const TBA_BASE_URL = 'https://www.thebluealliance.com/api/v3';

export interface TBATeam {
  team_number: number;
  nickname: string;
  city: string;
  state_prov: string;
  country: string;
}

interface TBATeamEventStatus {
  qual?: {
    ranking?: {
      record?: {
        wins: number;
        losses: number;
      };
      sort_orders?: number[];
    };
  };
  last_match_time?: number;
}

export interface TBAEvent {
  key: string;
  name: string;
  start_date: string;
  end_date: string;
  webcasts: Array<{
    type: string;
    channel: string;
  }>;
}

const getTBAHeaders = () => ({
  'X-TBA-Auth-Key': TBA_API_KEY,
  'Accept': 'application/json',
});

export const fetchEventDetails = async (eventKey: string): Promise<TBAEvent> => {
  if (!TBA_API_KEY) {
    throw new Error('TBA API key is not configured');
  }

  if (!eventKey) {
    throw new Error('Event key is required');
  }

  try {
    const response = await fetch(
      `${TBA_BASE_URL}/event/${eventKey}`,
      { headers: getTBAHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch event details: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
};

export const fetchEventTeams = async (eventKey: string) => {
  if (!eventKey) {
    throw new Error('Event key is required');
  }

  if (!TBA_API_KEY) {
    throw new Error('TBA API key is not configured');
  }

  try {
    // Fetch basic team information
    const response = await fetch(
      `${TBA_BASE_URL}/event/${eventKey}/teams/simple`,
      { headers: getTBAHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
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
    throw error;
  }
};