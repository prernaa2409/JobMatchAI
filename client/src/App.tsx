import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Analyze from "@/pages/Analyze";
import AnalysisDetail from "@/pages/AnalysisDetail";
import Improve from "@/pages/Improve";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={() => <Auth mode="login" />} />
      <Route path="/signup" component={() => <Auth mode="signup" />} />
      <Route path="/dashboard" component={() => (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )} />
      <Route path="/analyze" component={() => (
        <ProtectedRoute>
          <Analyze />
        </ProtectedRoute>
      )} />
      <Route path="/analysis/:id" component={() => (
        <ProtectedRoute>
          <AnalysisDetail />
        </ProtectedRoute>
      )} />
      <Route path="/improve" component={() => (
        <ProtectedRoute>
          <Improve />
        </ProtectedRoute>
      )} />
      <Route path="/admin" component={() => (
        <ProtectedRoute adminOnly>
          <Admin />
        </ProtectedRoute>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
