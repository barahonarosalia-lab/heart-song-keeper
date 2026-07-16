import { Navigation } from "@/components/site/Navigation";
import { Hero } from "@/components/site/Hero";
import { TierPicker } from "@/components/site/TierPicker";
import { CardSection } from "@/components/site/CardSection";
import { ForEveryLove } from "@/components/site/ForEveryLove";
import { Collections } from "@/components/site/Collections";
import { HowItWorks } from "@/components/site/HowItWorks";
import { TwoWaysToGive } from "@/components/site/TwoWaysToGive";
import { Products } from "@/components/site/Products";

import { Footer } from "@/components/site/Footer";
import { CookieConsent } from "@/components/site/CookieConsent";

const Index = () => {
  return (
    <main className="min-h-screen bg-cream text-navy">
      <Navigation />
      <Hero />
      <TierPicker />
      <ForEveryLove />
      <TwoWaysToGive />
      <Products />
      <HowItWorks />
      <Collections />
      <CardSection />
      
      
      <Footer />
      <CookieConsent />
    </main>
  );
};

export default Index;
