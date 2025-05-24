import { useLocation, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "@/pages/home";
import SubscriptionsPage from "@/pages/subscriptions";
import CommunityPage from "@/pages/community";
import SalonDetailPage from "@/pages/salon-detail";
import AIGeneratorPage from "@/pages/generate";
import GalleryPage from "@/pages/gallery";
import ProfilePage from "@/pages/profile";

function Router() {
  const [location] = useLocation(); // Отримуємо поточний шлях

  return (
    <AppLayout currentPath={location}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/subscriptions" component={SubscriptionsPage} />
        <Route path="/generate" component={AIGeneratorPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/salon/:id" component={SalonDetailPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
