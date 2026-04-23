import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import cardMockup from "@/assets/card-mockup.png";

export const CardSection = () => {
  return (
    <section className="relative bg-navy text-cream py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 starfield opacity-20" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Text */}
          <div className="space-y-6">
            <p className="label-eyebrow text-gold">Included with every order</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream text-balance leading-[1.05]">
              The card is where <span className="italic text-gold">it begins.</span>
            </h2>
            <div className="space-y-4 text-cream/70 leading-relaxed text-[17px] max-w-xl">
              <p>
                Before they unwrap anything. Before they scan anything. They read it.
              </p>
              <p>
                A personal message written just for them. Their QR code inside. On
                thick matte stock that feels like an invitation — not a receipt.
              </p>
              <p>
                Frameable. Keepsake quality. Something they'll tuck into a wedding
                album, a memory box, or a drawer they open when they need to feel
                it again.
              </p>
            </div>
            <p className="text-gold/90 text-sm leading-relaxed pt-2">
              Included with every Key of Hearts. Even digital orders receive a
              beautiful PDF card by email.
            </p>
            <div className="pt-4">
              <Button variant="gold" size="lg" asChild>
                <a href="#how">
                  See how it works <ArrowRight />
                </a>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute -inset-8 bg-gold/15 blur-3xl rounded-full pointer-events-none" />
              <img
                src={cardMockup}
                alt="Premium 5x7 keepsake card with botanical illustration and QR code"
                width={1024}
                height={1024}
                loading="lazy"
                className="relative w-full max-w-md drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)] rotate-[-4deg]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
