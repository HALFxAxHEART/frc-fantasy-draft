import { createContext, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Team {
  teamNumber: number;
  teamName: string;
  districtPoints: number;
  logoUrl?: string;
  stats: {
    wins: number;
    losses: number;
    opr: number;
    autoAvg: number;
  };
}

interface Participant {
  name: string;
  teams: Team[];
}

interface DraftState {
  participants: Participant[];
  selectedEvent: string;
  currentParticipantIndex: number;
  timeRemaining: number;
  draftComplete: boolean;
  draftStarted: boolean;
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
  const location = useLocation();
  const navigate = useNavigate();
  
  const [draftState, setDraftState] = useState<DraftState>(() => {
    const state = location.state;
    if (!state?.participants?.length) {
      navigate("/dashboard");
      return {
        participants: [],
        selectedEvent: "",
        currentParticipantIndex: 0,
        timeRemaining: 120,
        draftComplete: false,
        draftStarted: false,
      };
    }
    return {
      participants: state.participants.map((name: string) => ({
        name,
        teams: [],
      })),
      selectedEvent: state.selectedEvent || "",
      currentParticipantIndex: 0,
      timeRemaining: 120,
      draftComplete: false,
      draftStarted: false,
    };
  });

  return (
    <DraftStateContext.Provider value={{ draftState, setDraftState }}>
      {children}
    </DraftStateContext.Provider>
  );
};