import { Link } from "react-router-dom";
import { Navigation } from "@/components/site/Navigation";
import { Hero } from "@/components/site/Hero";
import { CardSection } from "@/components/site/CardSection";
import { ForEveryLove } from "@/components/site/ForEveryLove";
import { Collections } from "@/components/site/Collections";
import { HowItWorks } from "@/components/site/HowItWorks";
import { TwoWaysToGive } from "@/components/site/TwoWaysToGive";
import { Products } from "@/components/site/Products";
import { EmotionalProof } from "@/components/site/EmotionalProof";
import { Footer } from "@/components/site/Footer";
import { CookieConsent } from "@/components/site/CookieConsent";

const Index = () => {
  return (
    <main className="min-h-screen bg-cream text-navy">
      <Navigation />
      <Hero />
      <div className="bg-cream border-y border-gold/20">
        <div className="container py-3 text-center">
          <Link
            to="/giving"
            className="text-xs md:text-sm text-gold hover:text-gold-deep transition-colors"
          >
            🤍 A portion of every purchase supports causes as meaningful as the moments we preserve. Learn more →
          </Link>
        </div>
      </div>
      <CardSection />
      <ForEveryLove />
      <Collections />
      <HowItWorks />
      <TwoWaysToGive />
      <Products />
      <EmotionalProof />
      <Footer />
      <CookieConsent />
    </main>
  );
};

export default Index;

