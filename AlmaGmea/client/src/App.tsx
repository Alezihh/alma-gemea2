import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Result from "@/pages/result";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  // Check for shared result on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('result');
    
    if (token) {
      // Redirect to result page
      window.history.replaceState({}, '', `/result/${token}`);
    }
  }, []);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/result/:token" component={Result} />
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
