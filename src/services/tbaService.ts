const TBA_API_KEY = import.meta.env.VITE_TBA_API_KEY;
const TBA_BASE_URL = 'https://www.thebluealliance.com/api/v3';

export interface TBATeam {
  team_number: number;
  nickname: string;
  city: string;
  state_prov: string;
  country: string;
}

export interface TBATeamStats {
  wins: number;
  losses: number;
  opr: number;
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

export const fetchEventDetails = async (eventKey: string): Promise<TBAEvent> => {
  const headers = {
    'X-TBA-Auth-Key': TBA_API_KEY,
  };

  const response = await fetch(
    `${TBA_BASE_URL}/event/${eventKey}`,
    { headers }
  );
  return response.json();
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
  const headers = {
    'X-TBA-Auth-Key': TBA_API_KEY,
  };

  // Fetch teams for the event
  const teamsResponse = await fetch(
    `${TBA_BASE_URL}/event/${eventKey}/teams`,
    { headers }
  );
  const teams: TBATeam[] = await teamsResponse.json();

  // Fetch event stats
  const statsResponse = await fetch(
    `${TBA_BASE_URL}/event/${eventKey}/oprs`,
    { headers }
  );
  const stats = await statsResponse.json();

  // For each team, fetch their last event stats
  const teamsWithStats = await Promise.all(teams.map(async (team) => {
    const teamEventsResponse = await fetch(
      `${TBA_BASE_URL}/team/frc${team.team_number}/events/2024/statuses`,
      { headers }
    );
    const teamEvents: Record<string, TBATeamEventStatus> = await teamEventsResponse.json();
    
    // Find the last event's stats
    const lastEventStats = Object.values(teamEvents).reduce((latest: TBATeamEventStatus | null, current: TBATeamEventStatus) => {
      if (!latest || (current.last_match_time && latest.last_match_time && current.last_match_time > latest.last_match_time)) {
        return current;
      }
      return latest;
    }, null);

    return {
      teamNumber: team.team_number,
      teamName: team.nickname,
      districtPoints: 0, // This will be updated with actual district points
      stats: {
        wins: lastEventStats?.qual?.ranking?.record?.wins || 0,
        losses: lastEventStats?.qual?.ranking?.record?.losses || 0,
        opr: stats?.oprs?.[`frc${team.team_number}`] || 0,
        autoAvg: lastEventStats?.qual?.ranking?.sort_orders?.[0] || 0,
      }
    };
  }));

  return teamsWithStats;
};