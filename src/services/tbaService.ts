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

  // Fetch district points
  const districtPointsResponse = await fetch(
    `${TBA_BASE_URL}/event/${eventKey}/district_points`,
    { headers }
  );
  const districtPoints = await districtPointsResponse.json();

  return teams.map(team => ({
    teamNumber: team.team_number,
    teamName: team.nickname,
    districtPoints: districtPoints?.points?.[`frc${team.team_number}`]?.total || 0,
    stats: {
      wins: 0, // These would need to be calculated from match data if needed
      losses: 0,
      opr: stats?.oprs?.[`frc${team.team_number}`] || 0,
      autoAvg: 0, // This would need to be calculated from match data if needed
    }
  }));
};