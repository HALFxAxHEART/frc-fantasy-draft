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
  country: string;
  start_date: string;
  end_date: string;
  year: number;
}

export interface TBATeam {
  key: string;
  team_number: number;
  nickname: string;
  name: string;
  city: string;
  state_prov: string;
  country: string;
}

export const fetchEvents = async (year: number) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tba?year=${year}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json() as Promise<TBAEvent[]>;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events. Please try again.');
  }
};

export const fetchEventTeams = async (eventKey: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tba?eventKey=${eventKey}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }

    const teams = await response.json() as TBATeam[];
    
    // Transform TBA teams into the format expected by the application
    return teams.map(team => ({
      teamNumber: team.team_number,
      teamName: team.nickname || `Team ${team.team_number}`,
      districtPoints: 0, // Default value since TBA doesn't provide this
      stats: {
        wins: 0,
        losses: 0,
        opr: 0,
        autoAvg: 0
      }
    }));
  } catch (error) {
    console.error('Error fetching event teams:', error);
    throw new Error('Failed to fetch teams. Please try again.');
  }
};