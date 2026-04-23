import { Navigation } from "@/components/site/Navigation";
import { Hero } from "@/components/site/Hero";
import { Explainer } from "@/components/site/Explainer";
import { ForEveryLove } from "@/components/site/ForEveryLove";
import { Collections } from "@/components/site/Collections";
import { HowItWorks } from "@/components/site/HowItWorks";
import { TwoWaysToGive } from "@/components/site/TwoWaysToGive";
import { CardSection } from "@/components/site/CardSection";
import { Products } from "@/components/site/Products";
import { EmotionalProof } from "@/components/site/EmotionalProof";
import { Footer } from "@/components/site/Footer";
import { CookieConsent } from "@/components/site/CookieConsent";

const Index = () => {
  return (
    <main className="min-h-screen bg-cream text-navy">
      <Navigation />
      <Hero />
      <Explainer />
      <ForEveryLove />
      <Collections />
      <HowItWorks />
      <TwoWaysToGive />
      <CardSection />
      <Products />
      <EmotionalProof />
      <Footer />
      <CookieConsent />
    </main>
  );
};

export default Index;
