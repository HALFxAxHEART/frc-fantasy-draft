import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface Participant {
  name: string;
  teams: Array<{
    teamNumber: number;
    districtPoints: number;
  }>;
}

interface DraftState {
  participants: Participant[];
  selectedEvent: string;
  currentParticipantIndex: number;
  timeRemaining: number;
  draftComplete: boolean;
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
    };
  });

  const [availableTeams, setAvailableTeams] = useState<Array<{
    teamNumber: number;
    districtPoints: number;
  }>>([]);

  useEffect(() => {
    // Fetch teams for the selected event
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
            districtPoints: Math.floor(Math.random() * 100), // Simulated district points
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

  useEffect(() => {
    if (!draftState.draftComplete && draftState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setDraftState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [draftState.draftComplete, draftState.timeRemaining]);

  const selectTeam = (teamNumber: number) => {
    if (draftState.timeRemaining === 0) {
      toast({
        title: "Time's up!",
        description: "Your turn has ended",
        variant: "destructive",
      });
      return;
    }

    const team = availableTeams.find((t) => t.teamNumber === teamNumber);
    if (!team) return;

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
      prev.filter((t) => t.teamNumber !== teamNumber)
    );
  };

  const calculateWinner = () => {
    return draftState.participants.map((participant) => {
      const sortedTeams = [...participant.teams].sort(
        (a, b) => b.districtPoints - a.districtPoints
      );
      // Remove highest and lowest scoring teams
      const countedTeams = sortedTeams.slice(1, -1);
      const totalPoints = countedTeams.reduce(
        (sum, team) => sum + team.districtPoints,
        0
      );
      return {
        name: participant.name,
        points: totalPoints,
      };
    }).sort((a, b) => b.points - a.points)[0];
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {draftState.draftComplete
              ? "Draft Complete!"
              : `${draftState.participants[draftState.currentParticipantIndex].name}'s Turn`}
          </h2>
          {!draftState.draftComplete && (
            <div className="mb-4">
              <p className="text-lg">
                Time Remaining: {Math.floor(draftState.timeRemaining / 60)}:
                {(draftState.timeRemaining % 60).toString().padStart(2, "0")}
              </p>
            </div>
          )}

          {draftState.draftComplete ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Winner: {calculateWinner().name}</h3>
              <p>Total Points: {calculateWinner().points}</p>
              <Button onClick={() => navigate("/dashboard")}>
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableTeams.map((team) => (
                <Button
                  key={team.teamNumber}
                  onClick={() => selectTeam(team.teamNumber)}
                  variant="outline"
                  className="p-4"
                >
                  Team {team.teamNumber}
                  <br />
                  Points: {team.districtPoints}
                </Button>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Selected Teams</h3>
          <div className="space-y-4">
            {draftState.participants.map((participant, index) => (
              <div key={participant.name} className="space-y-2">
                <h4 className="font-semibold">{participant.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {participant.teams.map((team) => (
                    <span
                      key={team.teamNumber}
                      className="inline-block bg-muted px-3 py-1 rounded-full text-sm"
                    >
                      Team {team.teamNumber} ({team.districtPoints} pts)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Draft;