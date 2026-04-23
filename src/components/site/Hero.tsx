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

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)] py-16 lg:py-24">
        {/* Left text */}
        <div className="space-y-8 max-w-xl animate-fade-up">
          <p className="label-eyebrow text-gold">Life With Art Co.</p>

          <h1 className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] text-cream tracking-tight text-balance">
            The key to their{" "}
            <span className="italic text-gold">heart.</span>
            <br />
            Forever.
          </h1>

          <p className="text-lg md:text-xl text-cream/60 max-w-md leading-relaxed">
            A song. A voice. A story.<br />
            Behind a QR code.<br />
            On something they hold forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center pt-2">
            <Button variant="gold" size="lg" asChild>
              <a href="#start">
                Find their key <ArrowRight className="ml-1" />
              </a>
            </Button>
            <Button variant="cream" size="lg" asChild>
              <a href="#how">See how it works</a>
            </Button>
          </div>
        </div>

        {/* Right key */}
        <div className="relative flex items-center justify-center order-first lg:order-last">
          <div className="relative w-full max-w-[420px] md:max-w-[500px] animate-float">
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

      {/* Bottom fade to cream */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-cream pointer-events-none" />
    </section>
  );
};
