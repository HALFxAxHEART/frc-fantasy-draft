import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 max-w-2xl mx-auto"
      >
        <span className="px-4 py-1.5 bg-accent text-white text-sm font-medium rounded-full">
          FRC Fantasy Draft
        </span>
        <h1 className="text-6xl font-bold text-secondary mt-4">
          Draft Your Dream FRC Alliance
        </h1>
        <p className="text-lg text-gray-600 mt-6">
          Create your fantasy FRC team, compete with friends, and prove your
          strategic prowess in the world of competitive robotics.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg text-lg transition-all">
              Get Started
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" className="px-8 py-6 rounded-lg text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;