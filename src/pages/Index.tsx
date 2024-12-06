import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No valid session found");
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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