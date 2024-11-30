import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 md:space-y-6"
        >
          <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full">
            FRC Fantasy Draft
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-4">
            Draft Your Dream FRC Alliance
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mt-4 md:mt-6 max-w-2xl mx-auto px-4">
            Create your fantasy FRC team, compete with friends, and prove your
            strategic prowess in the world of competitive robotics.
          </p>
          <div className="flex gap-4 justify-center mt-6 md:mt-8">
            <Link to="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-4 md:py-6 rounded-lg text-base md:text-lg transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4"
        >
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">1. Create Your Draft</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Start by selecting an FRC event and inviting participants to join your draft. Each participant will get a chance to pick teams in a predetermined order.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">2. Draft Teams</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              When it's your turn, pick from the available teams. Each participant gets 5 picks, and teams can only be selected once. Choose wisely based on team statistics and performance!
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">3. Compete</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              After the draft, follow your teams through the event. Your score will be based on your teams' performance throughout the competition.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;