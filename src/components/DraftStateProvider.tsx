import { createContext, useContext, useState } from "react";
import { Team } from "@/types/draft";

interface DraftParticipant {
  name: string;
  teams: Team[];
}

interface DraftState {
  participants: DraftParticipant[];
  selectedEvent: string;
  currentParticipantIndex: number;
  timeRemaining: number;
  draftComplete: boolean;
  draftStarted: boolean;
  maxTeamsPerParticipant: number;
  isGlobalDraft: boolean;
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
    timeRemaining: 120,
    draftComplete: false,
    draftStarted: false,
    maxTeamsPerParticipant: 5,
    isGlobalDraft: false,
  });

  return (
    <DraftStateContext.Provider value={{ draftState, setDraftState }}>
      {children}
    </DraftStateContext.Provider>
  );
};