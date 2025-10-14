import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/analyze" component={Analyze} />
      <Route path="/analysis/:id" component={AnalysisDetail} />
      <Route path="/improve" component={Improve} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
