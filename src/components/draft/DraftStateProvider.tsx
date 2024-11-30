import { createContext, useContext, useState } from "react";
import { Team } from "@/types/draft";

interface DraftTeam {
  name: string;
  participants: string[];
  selectedTeams: Team[];
}

interface DraftState {
  participants: Array<{ name: string; teams: Team[] }>;
  selectedEvent: string;
  currentParticipantIndex: number;
  currentTeamIndex: number;
  timeRemaining: number;
  draftComplete: boolean;
  draftStarted: boolean;
  teams: DraftTeam[];
}

interface DraftStateContextType {
  draftState: DraftState;
  setDraftState: React.Dispatch<React.SetStateAction<DraftState>>;
}

const DraftStateContext = createContext<DraftStateContextType | undefined>(undefined);

export const useDraftState = () => {
  const context = useContext(DraftStateContext);
  if (!context) {
    throw new Error("useDraftState must be used within a DraftStateProvider");
  }
  return context;
};

export const DraftStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [draftState, setDraftState] = useState<DraftState>({
    participants: [],
    selectedEvent: "",
    currentParticipantIndex: 0,
    currentTeamIndex: 0,
    timeRemaining: 120,
    draftComplete: false,
    draftStarted: false,
    teams: [],
  });

  return (
    <DraftStateContext.Provider value={{ draftState, setDraftState }}>
      {children}
    </DraftStateContext.Provider>
  );
};