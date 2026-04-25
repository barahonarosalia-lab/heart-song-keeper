import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Tier = {
  label: string;
  price?: string;
  note?: string;
  options?: { price: string; material: string }[];
};
type ProductRow = {
  category: string;
  tagline: string;
  signature: Tier;
  preserve: Tier;
};

const rows: ProductRow[] = [
  {
    category: "Digital Downloads",
    tagline: "Instant. Printable. Frameable.",
    signature: { label: "Signature", price: "$29" },
    preserve: { label: "Preserve", price: "$49" },
  },
  {
    category: "Canvas Prints",
    tagline: "Gallery wrap. Ready to hang.",
    signature: { label: "Signature", price: "$79" },
    preserve: { label: "Preserve", price: "$99" },
  },
  {
    category: "Acrylic Ornaments",
    tagline: "A keepsake that plays their song.",
    signature: { label: "Signature", price: "$59" },
    preserve: { label: "Preserve", price: "$79" },
  },
  {
    category: "Jewelry",
    tagline: "Worn every day. Scanned anytime.",
    signature: { label: "Signature", price: "$89", note: "Silver · Gold +$30" },
    preserve: { label: "Preserve", price: "$109", note: "Silver · Gold +$30" },
  },
  {
    category: "Sherpa Blankets",
    tagline: "Wrap up. Press play. They're there.",
    signature: { label: "Signature", price: "$119" },
    preserve: { label: "Preserve", price: "$139" },
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="pt-32 pb-24">
        <section className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="label-eyebrow text-gold mb-6">PRICING</p>
            <h1 className="font-serif text-4xl md:text-6xl text-navy mb-6 leading-tight">
              Every Key, <span className="italic text-rose">two ways</span>
            </h1>
            <p className="text-navy/70 text-lg leading-relaxed">
              Choose how they hold it. Then choose how deeply it sounds.
            </p>
          </div>

          <div className="space-y-5">
            {rows.map((r) => (
              <article
                key={r.category}
                className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden"
              >
                <div className="grid md:grid-cols-[1fr_auto_auto] gap-6 md:gap-10 p-7 md:p-9 items-center">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-navy leading-tight mb-2">
                      {r.category}
                    </h2>
                    <p className="font-serif italic text-navy/60 text-base">
                      "{r.tagline}"
                    </p>
                  </div>
                  <TierBlock tier={r.signature} accent="navy" />
                  <TierBlock tier={r.preserve} accent="gold" />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-gold/30 bg-gold/5 px-7 py-6 text-center">
              <p className="label-eyebrow text-gold mb-3">A NOTE ON PRESERVE</p>
              <p className="text-navy/80 leading-relaxed">
                Preserve adds a voice recording mixed with original music.
                <br className="hidden sm:inline" />
                <span className="font-medium text-navy"> Always +$20.</span>
              </p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <Button variant="gold" size="lg" asChild>
              <Link to="/start">Find their Key →</Link>
            </Button>
            <p className="mt-6 text-sm text-navy/60">
              🇺🇸 Free US shipping · 🌍 International calculated at checkout
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const TierBlock = ({
  tier,
  accent,
}: {
  tier: Tier;
  accent: "navy" | "gold";
}) => (
  <div className="text-center md:text-right md:min-w-[140px]">
    <p
      className={`label-eyebrow mb-2 ${accent === "gold" ? "text-gold" : "text-navy/60"}`}
    >
      {tier.label}
    </p>
    <p className="font-serif text-3xl md:text-4xl text-navy leading-none">
      {tier.price}
    </p>
    {tier.note && (
      <p className="mt-2 text-xs text-navy/50 italic">{tier.note}</p>
    )}
  </div>
);

export default Pricing;
