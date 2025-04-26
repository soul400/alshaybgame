import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import GamePage from "@/pages/GamePage";
import PenaltyPage from "@/pages/PenaltyPage";
import Notification from "@/components/Notification";
import { GameProvider } from "./context/GameContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/game/:gameId" component={GamePage} />
      <Route path="/penalty" component={PenaltyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <GameProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Notification />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </GameProvider>
  );
}

export default App;
