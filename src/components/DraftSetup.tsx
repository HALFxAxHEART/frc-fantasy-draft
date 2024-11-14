import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "framer-motion";

interface DraftSetupProps {
  participants: Array<{ name: string; teams: any[] }>;
  onStartDraft: () => void;
}

export const DraftSetup = ({ participants, onStartDraft }: DraftSetupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Draft Order</h2>
        <div className="space-y-4">
          {participants.map((participant, index) => (
            <div
              key={participant.name}
              className="flex items-center space-x-4 p-4 bg-muted rounded-lg"
            >
              <span className="text-2xl font-bold text-primary">{index + 1}</span>
              <span className="font-medium">{participant.name}</span>
            </div>
          ))}
        </div>
        <Button
          className="w-full mt-6"
          size="lg"
          onClick={onStartDraft}
        >
          Start Draft
        </Button>
      </Card>
    </motion.div>
  );
};