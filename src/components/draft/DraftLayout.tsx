import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DraftLayoutProps {
  children: ReactNode;
}

export const DraftLayout = ({ children }: DraftLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};