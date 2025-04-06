
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PlayerProfilePage from "./pages/PlayerProfilePage";
import ScoutingPage from "./pages/ScoutingPage";
import StakeholderProfilePage from "./pages/StakeholderProfilePage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    
    {/* New Pages */}
    <Route path="/explore" element={<ScoutingPage />} />
    <Route path="/matching" element={<DashboardPage />} />
    <Route path="/recommendations" element={<DashboardPage />} />
    <Route path="/opportunities" element={<DashboardPage />} />
    <Route path="/messaging" element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } />
    
    {/* Protected Routes */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } 
    />
    
    {/* Player Profile - No longer protected, can be viewed by anyone */}
    <Route path="/players/:id" element={<PlayerProfilePage />} />
    
    <Route 
      path="/discover" 
      element={
        <ProtectedRoute>
          <ScoutingPage />
        </ProtectedRoute>
      } 
    />
    
    {/* Stakeholder routes */}
    <Route path="/clubs/:id" element={<StakeholderProfilePage />} />
    <Route path="/managers/:id" element={<StakeholderProfilePage />} />
    <Route path="/agents/:id" element={<StakeholderProfilePage />} />
    <Route path="/services/:id" element={<StakeholderProfilePage />} />
    <Route path="/coaches/:id" element={<StakeholderProfilePage />} />
    <Route path="/sponsors/:id" element={<StakeholderProfilePage />} />
    <Route path="/equipment-suppliers/:id" element={<StakeholderProfilePage />} />
    <Route path="/:type/:id" element={<StakeholderProfilePage />} />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
