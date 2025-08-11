import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <AppHeader />
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppHeader />
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/music" element={
                <ProtectedRoute>
                  <AppHeader />
                  <MusicCorner />
                </ProtectedRoute>
              } />
              <Route path="/touch" element={
                <ProtectedRoute>
                  <AppHeader />
                  <TouchGames />
                </ProtectedRoute>
              } />
              <Route path="/visual" element={
                <ProtectedRoute>
                  <AppHeader />
                  <VisualCalm />
                </ProtectedRoute>
              } />
              <Route path="/sound" element={
                <ProtectedRoute>
                  <AppHeader />
                  <Soundscapes />
                </ProtectedRoute>
              } />
              <Route path="/breathing" element={
                <ProtectedRoute>
                  <AppHeader />
                  <Breathing />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <AppHeader />
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AppHeader />
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/parental" element={
                <ProtectedRoute>
                  <AppHeader />
                  <Parental />
                </ProtectedRoute>
              } />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <EmergencyCalm />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
