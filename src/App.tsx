import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import Start from "./pages/Start.tsx";
import Order from "./pages/Order.tsx";
import Listen from "./pages/Listen.tsx";
import Upgrade from "./pages/Upgrade.tsx";
import CollectionsPage from "./pages/Collections.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import Pricing from "./pages/Pricing.tsx";
import GiftCards from "./pages/GiftCards.tsx";
import ArtCompanion from "./pages/ArtCompanion.tsx";
import Upload from "./pages/Upload.tsx";
import Choose from "./pages/Choose.tsx";
import Giving from "./pages/Giving.tsx";
import Faq from "./pages/Faq.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import Login from "./pages/Login.tsx";
import OAuthConsent from "./pages/OAuthConsent.tsx";
import { Placeholder } from "./pages/Placeholder.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { PaymentTestModeBanner } from "./components/PaymentTestModeBanner.tsx";
import { GivingBanner } from "./components/site/GivingBanner.tsx";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <GivingBanner />
        <PaymentTestModeBanner />
        <Routes>
          <Route path="/" element={<ComingSoon />} />
          <Route path="/home" element={<Index />} />
          <Route path="/start" element={<Start />} />
          <Route path="/order/:orderId" element={<Order />} />
          <Route path="/listen/:orderId" element={<Listen />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/art-companion" element={<ArtCompanion />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/giving" element={<Giving />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
          <Route path="/accessibility" element={<Placeholder eyebrow="ACCESSIBILITY" title="Our accessibility statement is on the way." />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
