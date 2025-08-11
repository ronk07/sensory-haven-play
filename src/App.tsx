import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import MusicCorner from "./pages/MusicCorner";
import TouchGames from "./pages/TouchGames";
import VisualCalm from "./pages/VisualCalm";
import Soundscapes from "./pages/Soundscapes";
import Breathing from "./pages/Breathing";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Parental from "./pages/Parental";
import { AppHeader } from "./components/layout/AppHeader";
import { EmergencyCalm } from "./components/EmergencyCalm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppHeader />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/music" element={<MusicCorner />} />
            <Route path="/touch" element={<TouchGames />} />
            <Route path="/visual" element={<VisualCalm />} />
            <Route path="/sound" element={<Soundscapes />} />
            <Route path="/breathing" element={<Breathing />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/parental" element={<Parental />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <EmergencyCalm />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
