import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DraftLayoutProps {
  children: ReactNode;
}

export const DraftLayout = ({ children }: DraftLayoutProps) => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};