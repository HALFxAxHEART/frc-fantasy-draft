export interface Team {
  teamNumber: number;
  teamName: string;
  districtPoints?: number;
  logoUrl?: string;
  stats: {
    wins?: number;
    losses?: number;
    opr?: number;
    autoAvg?: number;
    ranking?: number;
  };
}

export interface DraftParticipant {
  name: string;
  teams: Team[];
}

export interface DraftState {
  participants: DraftParticipant[];
  selectedEvent: string;
  currentParticipantIndex: number;
  timeRemaining: number;
  draftComplete: boolean;
  draftStarted: boolean;
}

export interface DraftData {
  participants: DraftParticipant[];
  draft_data: {
    availableTeams: Team[];
  };
  event_name: string;
  event_key: string;
  nickname?: string;
}