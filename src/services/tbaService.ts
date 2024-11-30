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

const fetchWithTBAAuth = async (url: string) => {
  if (!TBA_API_KEY) {
    throw new Error('TBA API key is not configured. Please check your environment variables.');
  }

  try {
    const response = await fetch(url, {
      headers: {
        'X-TBA-Auth-Key': TBA_API_KEY,
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching from TBA API (${url}):`, error);
    throw error;
  }
};

export const fetchEventDetails = async (eventKey: string): Promise<TBAEvent> => {
  if (!eventKey) {
    throw new Error('Event key is required');
  }

  return fetchWithTBAAuth(`${TBA_BASE_URL}/event/${eventKey}`);
};

export const fetchEvents = async (year: number) => {
  return fetchWithTBAAuth(`${TBA_BASE_URL}/events/${year}`);
};

export const fetchEventTeams = async (eventKey: string): Promise<Array<{
  teamNumber: number;
  teamName: string;
  districtPoints: number;
  stats: {
    wins: number;
    losses: number;
    opr: number;
    autoAvg: number;
  };
}>> => {
  if (!eventKey) {
    throw new Error('Event key is required');
  }

  try {
    // Fetch teams for the event
    const teams: TBATeam[] = await fetchWithTBAAuth(`${TBA_BASE_URL}/event/${eventKey}/teams`);
    
    // Fetch event stats
    let stats;
    try {
      stats = await fetchWithTBAAuth(`${TBA_BASE_URL}/event/${eventKey}/oprs`);
    } catch (error) {
      console.warn('Failed to fetch OPR stats, using default values');
      stats = null;
    }

    // For each team, fetch their event status
    const teamsWithStats = await Promise.all(teams.map(async (team) => {
      try {
        const teamEvents = await fetchWithTBAAuth(
          `${TBA_BASE_URL}/team/frc${team.team_number}/event/${eventKey}/status`
        );

        const qualRanking = teamEvents?.qual?.ranking || {};
        const record = qualRanking?.record || { wins: 0, losses: 0 };

        return {
          teamNumber: team.team_number,
          teamName: team.nickname || `Team ${team.team_number}`,
          districtPoints: 0,
          stats: {
            wins: record.wins || 0,
            losses: record.losses || 0,
            opr: stats?.oprs?.[`frc${team.team_number}`] || 0,
            autoAvg: qualRanking?.sort_orders?.[3] || 0,
          }
        };
      } catch (error) {
        console.warn(`Failed to fetch status for team ${team.team_number}`, error);
        return {
          teamNumber: team.team_number,
          teamName: team.nickname || `Team ${team.team_number}`,
          districtPoints: 0,
          stats: {
            wins: 0,
            losses: 0,
            opr: stats?.oprs?.[`frc${team.team_number}`] || 0,
            autoAvg: 0,
          }
        };
      }
    }));

    return teamsWithStats;
  } catch (error) {
    console.error('Error fetching event teams:', error);
    throw new Error('Failed to fetch teams data. Please check your internet connection and try again.');
  }
};