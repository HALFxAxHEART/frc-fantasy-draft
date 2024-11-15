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

export const fetchEventDetails = async (eventKey: string): Promise<TBAEvent> => {
  if (!TBA_API_KEY) {
    throw new Error('TBA API key is not configured. Please check your environment variables.');
  }

  if (!eventKey) {
    throw new Error('Event key is required');
  }

  const headers = {
    'X-TBA-Auth-Key': TBA_API_KEY,
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(
      `${TBA_BASE_URL}/event/${eventKey}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch event details: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw new Error('Failed to fetch event details. Please check your internet connection and try again.');
  }
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

  if (!TBA_API_KEY) {
    throw new Error('TBA API key is not configured. Please check your environment variables.');
  }

  const headers = {
    'X-TBA-Auth-Key': TBA_API_KEY,
    'Accept': 'application/json',
  };

  try {
    // Fetch teams for the event
    const teamsResponse = await fetch(
      `${TBA_BASE_URL}/event/${eventKey}/teams`,
      { headers }
    );

    if (!teamsResponse.ok) {
      throw new Error(`Failed to fetch teams: ${teamsResponse.statusText}`);
    }

    const teams: TBATeam[] = await teamsResponse.json();

    // Fetch event stats
    const statsResponse = await fetch(
      `${TBA_BASE_URL}/event/${eventKey}/oprs`,
      { headers }
    );

    if (!statsResponse.ok) {
      console.warn('Failed to fetch OPR stats, using default values');
    }

    const stats = statsResponse.ok ? await statsResponse.json() : null;

    // For each team, fetch their event status
    const teamsWithStats = await Promise.all(teams.map(async (team) => {
      try {
        const statusResponse = await fetch(
          `${TBA_BASE_URL}/team/frc${team.team_number}/events/2024/statuses`,
          { headers }
        );

        const teamEvents: Record<string, TBATeamEventStatus> = statusResponse.ok 
          ? await statusResponse.json()
          : {};

        // Find the last event's stats
        const lastEventStats = Object.values(teamEvents).reduce((latest: TBATeamEventStatus | null, current: TBATeamEventStatus) => {
          if (!latest || (current.last_match_time && latest.last_match_time && current.last_match_time > latest.last_match_time)) {
            return current;
          }
          return latest;
        }, null);

        return {
          teamNumber: team.team_number,
          teamName: team.nickname || `Team ${team.team_number}`,
          districtPoints: 0,
          stats: {
            wins: lastEventStats?.qual?.ranking?.record?.wins || 0,
            losses: lastEventStats?.qual?.ranking?.record?.losses || 0,
            opr: stats?.oprs?.[`frc${team.team_number}`] || 0,
            autoAvg: lastEventStats?.qual?.ranking?.sort_orders?.[0] || 0,
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