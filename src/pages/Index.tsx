import { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [selectedWeek, setSelectedWeek] = useState<string>("all");

  // Generate weeks array including Week 0
  const weeks = Array.from({ length: 9 }, (_, i) => ({
    value: i === 0 ? "0" : i.toString(),
    label: `Week ${i === 0 ? "0" : i}`,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            FRC Fantasy Draft
          </h1>
          <p className="text-lg text-muted-foreground">
            Create and manage your FRC Fantasy Draft teams
          </p>
          
          <div className="w-[200px]">
            <Select
              value={selectedWeek}
              onValueChange={setSelectedWeek}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Weeks</SelectItem>
                {weeks.map((week) => (
                  <SelectItem key={week.value} value={week.value}>
                    {week.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-full lg:col-span-2 space-y-4"
          >
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            <p className="text-muted-foreground">
              Welcome to FRC Fantasy Draft! Create your own draft or join an existing one to get started.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-full lg:col-span-1 space-y-4"
          >
            <h2 className="text-2xl font-semibold">Quick Links</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Create a new draft</li>
              <li>Join existing draft</li>
              <li>View your drafts</li>
              <li>Manage settings</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;