
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PlayerProfilePage from "./pages/PlayerProfilePage";
import ScoutingPage from "./pages/ScoutingPage";
import StakeholderProfilePage from "./pages/StakeholderProfilePage";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/players/:id" element={<PlayerProfilePage />} />
            <Route path="/discover" element={<ScoutingPage />} />
            <Route path="/opportunities" element={<DashboardPage />} />
            
            {/* Stakeholder routes */}
            <Route path="/clubs/:id" element={<StakeholderProfilePage />} />
            <Route path="/managers/:id" element={<StakeholderProfilePage />} />
            <Route path="/agents/:id" element={<StakeholderProfilePage />} />
            <Route path="/services/:id" element={<StakeholderProfilePage />} />
            <Route path="/:type/:id" element={<StakeholderProfilePage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
