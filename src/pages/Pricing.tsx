import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="pt-32 pb-24">
        <section className="container max-w-3xl text-center">
          <p className="label-eyebrow text-gold mb-6">PRICING</p>
          <h1 className="font-serif text-4xl md:text-6xl text-navy mb-6 leading-tight">
            Pricing is on the way.
          </h1>
          <p className="text-navy/70 text-lg italic mb-10">
            We're putting the finishing touches on our pricing page. In the meantime, every Key starts from $29.
          </p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/start">Find their Key →</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
