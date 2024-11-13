import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [participants, setParticipants] = useState(2);
  const [selectedEvent, setSelectedEvent] = useState("");

  return (
    <div className="min-h-screen bg-muted p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-secondary">Dashboard</h1>
          <Button variant="outline" onClick={() => {}}>
            Sign Out
          </Button>
        </div>

        <Card className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-secondary">
            Create New Draft
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Participants
              </label>
              <Input
                type="number"
                min="2"
                max="10"
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                className="w-full max-w-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Event
              </label>
              <Select>
                <option value="">Select an event...</option>
                {/* Event options will be populated from API */}
              </Select>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
              onClick={() => {}}
            >
              Start Draft
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-secondary mb-4">
            Previous Drafts
          </h2>
          <div className="text-gray-500 text-center py-8">
            No previous drafts found
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;