export interface Team {
  teamNumber: number;
  teamName: string;
  stats?: {
    wins: number;
    losses: number;
    opr?: number;
    autoAvg?: number;
    ranking?: number;
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
  event_key: string;
  nickname?: string;
  status?: 'pending' | 'active' | 'completed';
}