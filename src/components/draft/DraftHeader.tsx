import { motion } from "framer-motion";

interface DraftHeaderProps {
  eventName: string;
  nickname?: string;
}

export const DraftHeader = ({ eventName, nickname }: DraftHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <h1 className="text-3xl font-bold">
        {nickname ? `${nickname} - ${eventName}` : eventName}
      </h1>
    </motion.div>
  );
};