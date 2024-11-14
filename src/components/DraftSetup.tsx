import { useState } from "react";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { DraftOrderAnimation } from "./DraftOrderAnimation";

interface DraftSetupProps {
  participants: Array<{ name: string; teams: any[] }>;
  onStartDraft: () => void;
}

export const DraftSetup = ({ participants, onStartDraft }: DraftSetupProps) => {
  const [showAnimation, setShowAnimation] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {showAnimation && (
        <DraftOrderAnimation 
          participants={participants}
          onComplete={onStartDraft}
        />
      )}
    </motion.div>
  );
};