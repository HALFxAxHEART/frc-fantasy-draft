import { motion } from "framer-motion";

interface DraftHeaderProps {
  eventName: string;
  nickname?: string;
}

export const DraftHeader = ({ eventName, nickname }: DraftHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-4xl font-bold">{eventName}</h1>
      {nickname && <p className="text-muted-foreground mt-2">{nickname}</p>}
    </motion.div>
  );
};