import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <span className="inline-block px-6 py-2 bg-primary text-primary-foreground text-lg font-medium rounded-full">
            FRC Fantasy Draft
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mt-6">
            Draft Your Dream FRC Alliance
          </h1>
          <p className="text-xl text-muted-foreground mt-6 max-w-3xl mx-auto">
            Create your fantasy FRC team, compete with friends, and prove your
            strategic prowess in the world of competitive robotics.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="p-8 rounded-xl border bg-card shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">1. Create Your Draft</h3>
            <p className="text-lg text-muted-foreground">
              Start by selecting an FRC event and inviting participants to join your draft. Each participant will get a chance to pick teams in a predetermined order.
            </p>
          </div>
          <div className="p-8 rounded-xl border bg-card shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">2. Draft Teams</h3>
            <p className="text-lg text-muted-foreground">
              When it's your turn, pick from the available teams. Each participant gets 5 picks, and teams can only be selected once. Choose wisely based on team statistics and performance!
            </p>
          </div>
          <div className="p-8 rounded-xl border bg-card shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">3. Compete</h3>
            <p className="text-lg text-muted-foreground">
              After the draft, follow your teams through the event. Your score will be based on your teams' performance throughout the competition.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;