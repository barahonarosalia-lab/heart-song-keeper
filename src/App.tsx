import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Start from "./pages/Start.tsx";
import Order from "./pages/Order.tsx";
import Listen from "./pages/Listen.tsx";
import Upgrade from "./pages/Upgrade.tsx";
import CollectionsPage from "./pages/Collections.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import Pricing from "./pages/Pricing.tsx";
import GiftCards from "./pages/GiftCards.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/start" element={<Start />} />
          <Route path="/order/:orderId" element={<Order />} />
          <Route path="/listen/:orderId" element={<Listen />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
