import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { SupportTicketButton } from "@/components/SupportTicketButton";
import { FeatureRequestButton } from "@/components/FeatureRequestButton";
import { UserProfileButton } from "@/components/UserProfileButton";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Draft from "@/pages/Draft";
import DraftSelection from "@/pages/DraftSelection";
import GlobalDrafts from "@/pages/GlobalDrafts";
import GlobalDraft from "@/pages/GlobalDraft";
import Results from "@/pages/Results";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background">
          <div className="fixed top-4 right-4 z-50">
            <UserProfileButton />
          </div>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/draft-selection" element={<DraftSelection />} />
            <Route path="/draft/:draftId" element={<Draft />} />
            <Route path="/global-drafts" element={<GlobalDrafts />} />
            <Route path="/global-drafts/:draftId" element={<GlobalDraft />} />
            <Route path="/results/:draftId" element={<Results />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <SupportTicketButton />
          <FeatureRequestButton />
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;