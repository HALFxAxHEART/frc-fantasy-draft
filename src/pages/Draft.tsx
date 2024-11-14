import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { DraftTimer } from "@/components/DraftTimer";
import { TeamCard } from "@/components/TeamCard";
import { DraftOrder } from "@/components/DraftOrder";
import { DraftSetup } from "@/components/DraftSetup";
import { DraftComplete } from "@/components/DraftComplete";

interface DraftState {
  participants: Participant[];
  selectedEvent: string;
  currentParticipantIndex: number;
  timeRemaining: number;
  draftComplete: boolean;
  draftStarted: boolean;
}

interface Participant {
  name: string;
  teams: Array<{
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
  }>;
}

const Draft = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [draftState, setDraftState] = useState<DraftState>(() => {
    const state = location.state;
    if (!state) {
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
      ...state,
      participants: state.participants.map((name: string) => ({
        name,
        teams: [],
      })),
      currentParticipantIndex: 0,
      timeRemaining: 120,
      draftComplete: false,
      draftStarted: false,
    };
  });

  const [availableTeams, setAvailableTeams] = useState([]);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `https://www.thebluealliance.com/api/v3/event/${draftState.selectedEvent}/teams`,
          {
            headers: {
              "X-TBA-Auth-Key": import.meta.env.VITE_TBA_API_KEY,
            },
          }
        );
        const teams = await response.json();
        setAvailableTeams(
          teams.map((team: any) => ({
            teamNumber: team.team_number,
            teamName: team.nickname,
            districtPoints: Math.floor(Math.random() * 100),
            logoUrl: `https://www.thebluealliance.com/team/${team.team_number}`,
            stats: {
              wins: Math.floor(Math.random() * 10),
              losses: Math.floor(Math.random() * 10),
              opr: Math.random() * 50,
              autoAvg: Math.random() * 15,
            },
          }))
        );
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch teams for this event",
          variant: "destructive",
        });
      }
    };
    fetchTeams();
  }, [draftState.selectedEvent]);

  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: `${draftState.participants[draftState.currentParticipantIndex].name}'s turn has ended`,
      variant: "destructive",
    });
    setIsTimerActive(false);
  };

  const startDraft = () => {
    setDraftState((prev) => ({
      ...prev,
      draftStarted: true,
    }));
    setIsTimerActive(true);
    toast({
      title: "Draft Started",
      description: `${draftState.participants[0].name}'s turn to pick`,
    });
  };

  const selectTeam = (team: typeof availableTeams[0]) => {
    setDraftState((prev) => {
      const newParticipants = [...prev.participants];
      const currentParticipant = newParticipants[prev.currentParticipantIndex];
      
      if (currentParticipant.teams.length >= 5) {
        toast({
          title: "Maximum teams reached",
          description: "You can only select 5 teams",
          variant: "destructive",
        });
        return prev;
      }

      currentParticipant.teams.push(team);
      
      const nextParticipantIndex = 
        (prev.currentParticipantIndex + 1) % prev.participants.length;
      
      const draftComplete = newParticipants.every(
        (p) => p.teams.length === 5
      );

      return {
        ...prev,
        participants: newParticipants,
        currentParticipantIndex: nextParticipantIndex,
        timeRemaining: 120,
        draftComplete,
      };
    });

    setAvailableTeams((prev) =>
      prev.filter((t) => t.teamNumber !== team.teamNumber)
    );

    setIsTimerActive(true);

    toast({
      title: "Team Selected",
      description: `Team ${team.teamNumber} has been drafted`,
    });
  };

  if (!draftState.draftStarted) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <DraftSetup
            participants={draftState.participants}
            onStartDraft={startDraft}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <DraftOrder
              participants={draftState.participants}
              currentIndex={draftState.currentParticipantIndex}
            />
          </div>
          <div>
            <DraftTimer
              initialTime={draftState.timeRemaining}
              onTimeUp={handleTimeUp}
              isActive={isTimerActive && !draftState.draftComplete}
            />
          </div>
        </div>

        <Card className="p-6">
          {draftState.draftComplete ? (
            <DraftComplete participants={draftState.participants} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableTeams.map((team) => (
                <TeamCard
                  key={team.teamNumber}
                  {...team}
                  onSelect={() => selectTeam(team)}
                />
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Draft;
