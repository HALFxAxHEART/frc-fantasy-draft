const TBA_API_KEY = import.meta.env.VITE_TBA_API_KEY;
const TBA_BASE_URL = 'https://www.thebluealliance.com/api/v3';

export interface TBATeam {
  team_number: number;
  nickname: string;
  city: string;
  state_prov: string;
  country: string;
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

export const fetchEventDetails = async (eventKey: string): Promise<TBAEvent> => {
  const headers = {
    'X-TBA-Auth-Key': TBA_API_KEY,
  };

  const response = await fetch(
    `${TBA_BASE_URL}/event/${eventKey}`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch event details');
  }
  
  return response.json();
};

export const fetchEventTeams = async (eventKey: string): Promise<Array<{
  teamNumber: number;
  teamName: string;
  districtPoints: number;
  stats: {
    wins?: number;
    losses?: number;
    opr?: number;
    autoAvg?: number;
  };
}>> => {
  const headers = {
    'X-TBA-Auth-Key': TBA_API_KEY,
  };

  // Fetch teams for the event
  const teamsResponse = await fetch(
    `${TBA_BASE_URL}/event/${eventKey}/teams`,
    { headers }
  );
  
  if (!teamsResponse.ok) {
    throw new Error('Failed to fetch teams');
  }

  const teams: TBATeam[] = await teamsResponse.json();

  // Map teams to our format
  return teams.map((team) => ({
    teamNumber: team.team_number,
    teamName: team.nickname,
    districtPoints: 0,
    stats: {
      wins: 0,
      losses: 0,
      opr: 0,
      autoAvg: 0
    }
  }));
};