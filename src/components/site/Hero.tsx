import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroKey from "@/assets/hero-key.png";

export const Hero = () => {
  return (
    <section className="relative min-h-[55vh] md:min-h-[60vh] overflow-hidden bg-gradient-navy text-cream pt-8 md:pt-12">
      {/* Starfield layers */}
      <div className="absolute inset-0 starfield opacity-80 animate-twinkle" />
      <div className="absolute inset-0 starfield opacity-50" style={{ animationDelay: "1.5s" }} />

      {/* Soft gold glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="container relative z-10 py-10 md:py-14 flex items-center">
        <div className="w-full max-w-2xl space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-up text-left">
          <h1 className="font-serif text-[clamp(1.5rem,4.5vw,3.75rem)] leading-[1.05] text-cream tracking-tight text-balance">
            The key to their{" "}
            <span className="italic text-gold">heart.</span>{" "}
            Forever.
          </h1>

          <p className="font-serif italic text-gold text-lg">
            I'll find a way to tell you again.
          </p>

          <p className="text-lg md:text-xl text-cream/60 max-w-md leading-relaxed">
            A song. A voice. A story.<br />
            Behind a QR code.<br />
            On something they hold forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center pt-1 sm:pt-2">
            <div className="flex items-center gap-3">
              <img
                src={heroKey}
                alt="Ornate gold key with heart-shaped bow"
                width={1024}
                height={1024}
                className="h-12 sm:h-14 w-auto key-glow animate-float"
              />
              <Button variant="gold" size="lg" asChild>
                <a href="/start">
                  Find their key <ArrowRight className="ml-1" />
                </a>
              </Button>
            </div>
            <Button variant="cream" size="lg" asChild>
              <a href="#how">See how it works</a>
            </Button>
          </div>

          <div className="pt-1">
            <a
              href="/upgrade"
              className="text-xs italic text-cream/70 hover:text-cream transition-colors underline underline-offset-2"
            >
              Already have a Key of Hearts? Upgrade it →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade to cream */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-cream pointer-events-none" />
    </section>
  );
};
