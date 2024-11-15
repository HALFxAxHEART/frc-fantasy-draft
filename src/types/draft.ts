export interface Team {
  teamNumber: number;
  teamName: string;
  districtPoints: number;
  stats: {
    wins: number;
    losses: number;
    opr: number;
    autoAvg: number;
  };
}

export interface DraftParticipant {
  name: string;
  teams: Team[];
}

export interface DraftData {
  participants: DraftParticipant[];
  draft_data: {
    availableTeams: Team[];
  };
  event_name: string;
  event_key: string;  // Added this field
}