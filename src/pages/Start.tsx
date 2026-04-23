import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import luminaries from "@/assets/collection-luminaries.jpg";
import meadow from "@/assets/collection-meadow.jpg";
import fable from "@/assets/collection-fable.jpg";
import botanica from "@/assets/collection-botanica.jpg";
import ember from "@/assets/collection-ember.jpg";

const occasions = [
  { id: "baby-birth", name: "Baby & Birth", desc: "Welcome them into the world" },
  { id: "lullaby", name: "Lullaby & Nursery", desc: "Songs for sleepy nights" },
  { id: "new-parent", name: "New Parent", desc: "For the ones who just began" },
  { id: "pregnancy-loss", name: "Pregnancy Loss", desc: "Because they were here." },
  { id: "pet-memorial", name: "Pet Memorial", desc: "They were family. Every day." },
  { id: "friendship", name: "Friendship", desc: "For the one who's always there" },
  { id: "anniversary", name: "Anniversary & Wedding", desc: "The words. The song. Forever." },
  { id: "graduation", name: "Graduation", desc: "Four years. One moment." },
  { id: "college", name: "College Send-Off", desc: "For when you can't be there" },
  { id: "sobriety", name: "Sobriety & Recovery", desc: "Every day sober is worth remembering" },
  { id: "military", name: "Military & Deployment", desc: "He's overseas. He's still there." },
  { id: "memorial", name: "Memorial & Grief", desc: "Because they were here." },
  { id: "childhood", name: "Childhood Memory", desc: "Before the stories are gone" },
  { id: "birthday", name: "Birthday", desc: "For the one who deserves more than a card" },
  { id: "just-because", name: "Just Because", desc: "No occasion needed. Just someone worth celebrating." },
];

const collections = [
  { id: "luminaries", name: "Little Luminaries", img: luminaries, desc: "Soft, whimsical, and deeply loved.", mood: ["Gentle", "Playful", "Warm"] },
  { id: "meadow", name: "Meadow & Mane", img: meadow, desc: "Bold landscapes. Earned emotion.", mood: ["Strong", "Grounded", "Honest"] },
  { id: "fable", name: "Fable & Fawn", img: fable, desc: "Enchanted edge. Adult whimsy.", mood: ["Magical", "Soft", "Charming"] },
  { id: "botanica", name: "Moonlit Botanica", img: botanica, desc: "Dark florals. Quiet reverence.", mood: ["Reverent", "Timeless", "Dignified"] },
  { id: "ember", name: "Ember & Ivy", img: ember, desc: "Warm. Intimate. Romantic.", mood: ["Romantic", "Cozy", "Chosen"] },
];

const products = [
  {
    id: "digital",
    name: "Digital Download",
    priceLabel: "From $29 signature · $49 preserve",
    startingPrice: 29,
    tagline: "Instant. Printable. Frameable.",
    details: [
      "Delivered to inbox instantly",
      "High resolution PNG + PDF",
      "Print at home or any print shop",
      "QR code embedded in art",
    ],
    cta: "Choose Digital",
  },
  {
    id: "canvas",
    name: "Canvas Print — 11x14",
    priceLabel: "From $79 signature · $99 preserve",
    startingPrice: 79,
    tagline: "Gallery wrap. Ready to hang.",
    details: ["Ships in 4-6 business days", "Free shipping", "Add digital copy for +$10"],
    cta: "Choose Canvas",
  },
  {
    id: "ornament",
    name: "Acrylic Ornament",
    priceLabel: "From $59 signature · $79 preserve",
    startingPrice: 59,
    tagline: "A keepsake that plays their song — every time they hold it.",
    details: ["Gift box included", "Ships in 5-7 business days", "Free shipping"],
    cta: "Choose Ornament",
  },
  {
    id: "jewelry",
    name: "Jewelry",
    priceLabel: "From $89 silver · $99 gold (signature) · $109/$119 (preserve)",
    startingPrice: 89,
    tagline: "Worn every day. Scanned whenever they need it.",
    details: ["Heart · Circle · Dog Tag", "Ships in 5-7 business days", "Free shipping"],
    cta: "Choose Jewelry",
  },
  {
    id: "blanket",
    name: "Sherpa Blanket",
    priceLabel: "From $119 signature · $139 preserve",
    startingPrice: 119,
    tagline: "Wrap up. Press play. They're there.",
    details: [
      "50x60 inches · Full color",
      "Soft sherpa · Machine washable",
      "Ships in 3-5 business days",
      "Free shipping",
    ],
    cta: "Choose Blanket",
  },
];

const Start = () => {
  const navigate = useNavigate();
  const [occasion, setOccasion] = useState<string | null>(null);
  const [collection, setCollection] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);

  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const step1Done = !!occasion;
  const step2Unlocked = step1Done;
  const step2Done = !!collection;
  const step3Unlocked = step2Done;
  const step3Done = !!product;
  const allDone = step1Done && step2Done && step3Done;

  const completedCount = [step1Done, step2Done, step3Done].filter(Boolean).length;

  const selectedProduct = useMemo(() => products.find((p) => p.id === product), [product]);

  // Smooth scroll on unlock
  useEffect(() => {
    if (step1Done) step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step1Done]);
  useEffect(() => {
    if (step2Done) step3Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step2Done]);
  useEffect(() => {
    if (allDone) ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [allDone]);

  const handleContinue = () => {
    if (!allDone) return;
    const params = new URLSearchParams({
      occasion: occasion!,
      collection: collection!,
      product: product!,
    });
    navigate(`/personalize?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-cream text-navy">
      {/* Header */}
      <header className="bg-gradient-navy text-cream relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-40" />
        <div className="container relative z-10 py-10 md:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-cream/70 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>

          <div className="max-w-3xl space-y-4">
            <p className="label-eyebrow text-gold">Find Their Key</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-balance leading-[1.05]">
              Let's find the <span className="italic text-gold">perfect key.</span>
            </h1>
            <p className="text-cream/70 text-lg">Three choices. Then we do the rest.</p>
          </div>

          {/* Progress */}
          <div className="mt-10 max-w-md">
            <div className="flex items-center justify-between text-xs text-cream/60 mb-2">
              <span>Step {Math.min(completedCount + 1, 3)} of 3</span>
              <span>{completedCount}/3 complete</span>
            </div>
            <div className="h-1.5 rounded-full bg-cream/10 overflow-hidden">
              <div
                className="h-full bg-gradient-gold transition-all duration-500"
                style={{ width: `${(completedCount / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* STEP 1 */}
      <Section
        index="01"
        title="What moment are you celebrating?"
        subtitle="Every occasion has its own song."
        unlocked
        complete={step1Done}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {occasions.map((o) => {
            const selected = occasion === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setOccasion(o.id)}
                className={cn(
                  "relative text-left p-5 md:p-6 rounded-2xl bg-card border transition-all duration-300",
                  "hover:-translate-y-0.5 hover:shadow-card",
                  selected
                    ? "border-gold ring-2 ring-gold/40 shadow-card"
                    : "border-border/60",
                  !occasion && "animate-pulse-border-init",
                )}
              >
                {selected && (
                  <span className="absolute top-3 right-3 size-6 rounded-full bg-gold text-navy flex items-center justify-center">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                )}
                <h3 className="font-serif text-lg md:text-xl text-navy leading-tight mb-1.5 pr-7">
                  {o.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-snug text-balance">{o.desc}</p>
              </button>
            );
          })}
        </div>
      </Section>

      {/* STEP 2 */}
      <div ref={step2Ref}>
      <Section
        index="02"
        title="Choose the art that speaks to them."
        subtitle="Any collection for any occasion. You know them — trust that."
        unlocked={step2Unlocked}
        complete={step2Done}
      >
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {collections.map((c) => {
            const selected = collection === c.id;
            return (
              <button
                key={c.id}
                onClick={() => step2Unlocked && setCollection(c.id)}
                disabled={!step2Unlocked}
                className={cn(
                  "group relative text-left bg-card rounded-2xl overflow-hidden border transition-all duration-300",
                  "hover:-translate-y-0.5 hover:shadow-card",
                  selected
                    ? "border-gold ring-2 ring-gold/40 shadow-card"
                    : "border-border/60",
                )}
              >
                {selected && (
                  <span className="absolute top-4 right-4 z-10 size-8 rounded-full bg-gold text-navy flex items-center justify-center shadow-soft">
                    <Check className="size-5" strokeWidth={3} />
                  </span>
                )}
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-navy mb-2">{c.name}</h3>
                  <p className="text-[15px] text-muted-foreground mb-4">{c.desc}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {c.mood.map((m) => (
                      <span key={m} className="text-xs tracking-[0.2em] uppercase text-gold font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Section>
      </div>

      {/* STEP 3 */}
      <div ref={step3Ref}>
      <Section
        index="03"
        title="How would you like to give it?"
        subtitle="Every Key of Hearts works on any of these. Free shipping on every US order."
        unlocked={step3Unlocked}
        complete={step3Done}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {products.map((p) => {
            const selected = product === p.id;
            return (
              <article
                key={p.id}
                className={cn(
                  "relative bg-card rounded-2xl p-6 md:p-7 border transition-all duration-300 flex flex-col",
                  "hover:-translate-y-0.5 hover:shadow-card",
                  selected
                    ? "border-gold ring-2 ring-gold/40 shadow-card"
                    : "border-border/60",
                  !step3Unlocked && "opacity-60",
                )}
              >
                {selected && (
                  <span className="absolute top-4 right-4 size-7 rounded-full bg-gold text-navy flex items-center justify-center">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                )}
                <p className="label-eyebrow text-gold mb-2.5 pr-8">{p.priceLabel}</p>
                <h3 className="font-serif text-2xl text-navy mb-2 leading-tight">{p.name}</h3>
                <p className="font-serif italic text-navy/70 text-base mb-5 leading-snug text-balance">
                  "{p.tagline}"
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {p.details.map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
                <Button
                  variant={selected ? "gold" : "navy"}
                  className="w-full mt-auto"
                  disabled={!step3Unlocked}
                  onClick={() => setProduct(p.id)}
                >
                  {selected ? "Selected" : p.cta}
                </Button>
              </article>
            );
          })}
        </div>

        {/* Shipping notice */}
        <p className="mt-10 text-center text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          🇺🇸 Free shipping on every US order.<br />
          🌍 International customers pay shipping — calculated at checkout before payment.
        </p>

        {/* Live price */}
        {selectedProduct && (
          <div className="mt-10 text-center animate-fade-up">
            <p className="font-serif text-2xl md:text-3xl text-gold">
              Your Key of Hearts starts at ${selectedProduct.startingPrice}
            </p>
            <p className="text-sm text-muted-foreground mt-2">+ $20 for Preserve a Voice</p>
          </div>
        )}
      </Section>
      </div>

      {/* CONTINUE */}
      <div ref={ctaRef} className="container pb-32 pt-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          {!allDone && (
            <p className="text-gold text-sm md:text-base">
              Choose your occasion, collection, and product to continue
            </p>
          )}
          <Button
            variant="gold"
            size="xl"
            className="w-full"
            disabled={!allDone}
            onClick={handleContinue}
          >
            Continue to personalize <ArrowRight className="ml-1" />
          </Button>
          <p className="text-xs text-muted-foreground">
            You'll choose Signature or Preserve on the next page
          </p>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {allDone && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-4 bg-cream/95 backdrop-blur-md border-t border-border/60 animate-fade-up">
          <Button variant="gold" size="lg" className="w-full" onClick={handleContinue}>
            Continue to personalize <ArrowRight className="ml-1" />
          </Button>
        </div>
      )}
    </main>
  );
};

const Section = ({
  index,
  title,
  subtitle,
  unlocked,
  complete,
  children,
  ...rest
}: {
  index: string;
  title: string;
  subtitle: string;
  unlocked: boolean;
  complete: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <section
    {...rest}
    className={cn(
      "container py-16 md:py-24 scroll-mt-24 transition-opacity duration-500",
      !unlocked && "opacity-40 pointer-events-none select-none",
    )}
  >
    <div className="max-w-2xl mb-10 md:mb-12">
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-serif text-3xl md:text-4xl text-gold">{index}</span>
        {complete && (
          <span className="inline-flex items-center gap-1.5 text-xs label-eyebrow text-gold">
            <Check className="size-3.5" strokeWidth={3} /> Selected
          </span>
        )}
      </div>
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy text-balance leading-tight mb-3">
        {title}
      </h2>
      <p className="text-base md:text-lg text-navy/70 leading-relaxed">{subtitle}</p>
    </div>
    {children}
  </section>
);

export default Start;
