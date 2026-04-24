import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroKey from "@/assets/hero-key.png";

export const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-navy text-cream pt-20">
      {/* Starfield layers */}
      <div className="absolute inset-0 starfield opacity-80 animate-twinkle" />
      <div className="absolute inset-0 starfield opacity-50" style={{ animationDelay: "1.5s" }} />

      {/* Soft gold glow behind key */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="container relative z-10 py-12 md:py-16 lg:py-24 min-h-[calc(100vh-5rem)] flex items-center">
        <div className="w-full grid grid-cols-[1fr_auto] lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
          {/* Left text — vertically centered alongside the key */}
          <div className="space-y-5 sm:space-y-6 lg:space-y-8 max-w-xl animate-fade-up text-left">
            <p className="label-eyebrow text-gold">Life With Art Co.</p>

            <h1 className="font-serif text-[clamp(1.75rem,7vw,5.5rem)] leading-[1.02] text-cream tracking-tight text-balance">
              The key to their{" "}
              <span className="italic text-gold">heart.</span>
              <br />
              Forever.
            </h1>

            <p className="hidden sm:block text-lg md:text-xl text-cream/60 max-w-md leading-relaxed">
              A song. A voice. A story.<br />
              Behind a QR code.<br />
              On something they hold forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center pt-1 sm:pt-2">
              <Button variant="gold" size="lg" asChild>
                <a href="/start">
                  Find their key <ArrowRight className="ml-1" />
                </a>
              </Button>
              <Button variant="cream" size="lg" asChild>
                <a href="#how">See how it works</a>
              </Button>
            </div>
          </div>

          {/* Right key — sized to roughly match the text block height */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-[38vw] max-w-[160px] sm:max-w-[260px] md:max-w-[380px] lg:w-full lg:max-w-[500px] animate-float">
              <img
                src={heroKey}
                alt="Ornate gold key with heart-shaped bow"
                width={1024}
                height={1024}
                className="w-full h-auto key-glow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to cream */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-cream pointer-events-none" />
    </section>
  );
};
