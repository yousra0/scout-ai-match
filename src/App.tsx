import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import PlayerProfilePage from "./pages/PlayerProfilePage";
import ScoutingPage from "./pages/ScoutingPage";
import StakeholderProfilePage from "./pages/StakeholderProfilePage";
import MatchingPage from "./pages/MatchingPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import MessagingPage from "./pages/MessagingPage";
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

const AppRoutes = () => {
  const { user, isLoading, profile } = useAuth();

  // Guard: do nothing until loading is done!
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const profileRedirectPath = () => {
    if (profile?.user_type === "player" && user) return `/players/${user.id}`;
    if (profile?.user_type === "coach" && user) return `/coaches/${user.id}`;
    if (profile?.user_type === "agent" && user) return `/agents/${user.id}`;
    if (profile?.user_type === "club" && user) return `/clubs/${user.id}`;
    if (profile?.user_type === "sponsor" && user) return `/sponsors/${user.id}`;
    if (profile?.user_type === "equipment_supplier" && user) return `/equipment-suppliers/${user.id}`;
    return "/";
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          !user ? <LoginPage /> : <Navigate to={profileRedirectPath()} replace />
        }
      />
      <Route
        path="/register"
        element={
          !user ? <RegisterPage /> : <Navigate to={profileRedirectPath()} replace />
        }
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/explore" element={<ScoutingPage />} />
      <Route path="/matching" element={<MatchingPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/opportunities" element={<OpportunitiesPage />} />

      {/* Updated: Always redirect /profile to the right profile page */}
      <Route
        path="/profile"
        element={
          user ? (
            <Navigate to={profileRedirectPath()} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/messaging"
        element={
          <ProtectedRoute>
            <MessagingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Player Profile - open route */}
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
};

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
