import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TwoWaysToGive = () => {
  return (
    <section id="start" className="bg-cream py-24 md:py-32">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy text-balance">
            Two ways to give a <span className="italic text-gold">Key of Hearts</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Signature */}
          <Card
            title="Signature Key of Hearts"
            price="From $29"
            intro="Choose from our curated song collection. Three versions per occasion — instrumental, humming, or with lyrics. Pick the one that feels right."
            features={[
              "Original song for their occasion",
              "QR code plays forever",
              "Personalized card included",
              "Digital · Canvas · Ornament · Jewelry · Blanket",
            ]}
          />

          {/* Preserve a voice */}
          <Card
            title="Preserve a Voice"
            price="From $49"
            intro="Upload their audio or share their story. We wrap it in music and keep it safe forever."
            useFor={[
              "A voicemail from someone you lost",
              "A soldier recording bedtime stories",
              "Grandma reading their favorite book",
              "Wedding vows read again",
              "A heartbeat preserved",
              "A personal message for any moment",
            ]}
            features={[
              "Their voice · Their words · Their story",
              "QR code plays forever",
              "Personalized card included",
              "Audio upload optional — pay now, send later",
            ]}
            highlight
          />
        </div>
      </div>
    </section>
  );
};

const Card = ({
  title,
  price,
  intro,
  useFor,
  features,
  highlight,
}: {
  title: string;
  price: string;
  intro: string;
  useFor?: string[];
  features: string[];
  highlight?: boolean;
}) => (
  <div
    className={`relative rounded-3xl p-8 md:p-10 lg:p-12 flex flex-col bg-navy text-cream overflow-hidden border ${
      highlight ? "border-gold/40" : "border-cream/10"
    } shadow-card`}
  >
    {/* Subtle gold corner glow */}
    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

    <div className="relative">
      <p className="label-eyebrow text-gold mb-4">{price}</p>
      <h3 className="font-serif text-3xl md:text-4xl mb-5 text-balance">{title}</h3>
      <p className="text-cream/70 leading-relaxed mb-7">{intro}</p>

      {useFor && (
        <div className="mb-7">
          <p className="text-sm uppercase tracking-wider text-cream/50 mb-3">Use for:</p>
          <ul className="space-y-2 text-cream/80 text-[15px]">
            {useFor.map((u) => (
              <li key={u} className="flex gap-2">
                <span className="text-gold">·</span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="space-y-3 mb-9">
        {features.map((f) => (
          <li key={f} className="flex gap-3 text-cream/90 text-[15px]">
            <Check className="size-5 text-gold shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button variant="gold" size="lg" asChild>
          <a href="/start">
            Start here <ArrowRight />
          </a>
        </Button>
      </div>
    </div>
  </div>
);
