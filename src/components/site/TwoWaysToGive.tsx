import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TwoWaysToGive = () => {
  return (
    <section id="start" className="bg-cream py-24 md:py-32">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy text-balance">
            Three ways to give a <span className="italic text-gold">Key of Hearts</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Story */}
          <Card
            title="Story"
            price="From $49"
            intro="An original song written just for them. Tell us their story, pick their genre, and we'll turn it into music only they could recognize."
            features={[
              "Original song for their occasion",
              "Digital · Canvas · Ornament · Jewelry · Blanket · Vinyl Poster",
            ]}
          />

          {/* Voice */}
          <Card
            title="Voice"
            price="From $69"
            intro="Upload their voice or record something new. We wrap it in music and keep it safe forever."
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
              "Audio upload optional — pay now, send later",
            ]}
          />

          {/* Memory */}
          <Card
            title="Memory"
            price="From $79"
            intro="Upload a video and we turn it into a keepsake — their movement, their voice, wrapped in an original song."
            features={[
              "Their video, set to original music",
              "Video upload optional — pay now, send later",
            ]}
            highlight
          />
        </div>
        </div>
        <p className="text-center text-navy/70 max-w-xl mx-auto mt-10">
          All tiers include: a QR code that <span className="italic text-gold">scans, plays, and lasts forever</span> — plus a personalized card.
        </p>
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
    className={`relative rounded-3xl p-6 md:p-8 lg:p-9 flex flex-col bg-navy text-cream overflow-hidden border ${
      highlight ? "border-gold/40" : "border-cream/10"
    } shadow-card`}
  >
    {/* Subtle gold corner glow */}
    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

    <div className="relative">
      <p className="label-eyebrow text-gold mb-4">{price}</p>
      <h3 className="font-serif text-3xl md:text-4xl mb-4 text-balance">{title}</h3>
      <p className="text-cream/70 leading-relaxed mb-5">{intro}</p>

      {useFor && (
        <div className="mb-5">
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

      <ul className="space-y-3 mb-6">
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
