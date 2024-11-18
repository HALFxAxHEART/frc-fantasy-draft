import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Globe } from "lucide-react";

const DraftSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center">Choose Your Draft Type</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate("/dashboard")}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-center">Team Draft</h2>
                <p className="text-muted-foreground text-center">
                  Create a draft with your team and friends. Invite others to join and compete together.
                </p>
                <Button className="w-full" variant="outline">
                  Start Team Draft
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate("/global-drafts")}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Globe className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-center">Global Draft</h2>
                <p className="text-muted-foreground text-center">
                  Join the global FRC Fantasy draft. Compete with participants from around the world.
                </p>
                <Button className="w-full" variant="outline">
                  Join Global Draft
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DraftSelection;