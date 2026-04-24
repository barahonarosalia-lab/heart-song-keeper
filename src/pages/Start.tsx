import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ----- Types --------------------------------------------------------------

type Tier = "signature" | "preserve";

interface OrderState {
  tier: Tier | null;
}

// ----- Page ---------------------------------------------------------------

const Start = () => {
  const [order, setOrder] = useState<OrderState>({ tier: null });

  const step2Ref = useRef<HTMLDivElement>(null);

  const handleSelectTier = (tier: Tier) => {
    setOrder((prev) => ({ ...prev, tier }));
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  return (
    <main className="min-h-screen bg-cream text-navy">
      {/* HEADER */}
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
            <p className="text-cream/70 text-lg">A few choices. Then we do the rest.</p>
          </div>
        </div>
      </header>

      {/* STEP 1 */}
      <Step
        index="01"
        title="How would you like to gift them?"
        subtitle="This choice shapes everything — your song, your product, your price."
      >
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl">
          <TierCard
            label="SIGNATURE"
            heading="We compose their song"
            subtext="We've created original songs for every occasion. Preview three and pick the one that feels like them."
            examples="· Instrumental · Humming · With Lyrics"
            price="From $29"
            cta="Choose Signature"
            selected={order.tier === "signature"}
            onSelect={() => handleSelectTier("signature")}
          />
          <TierCard
            label="PRESERVE"
            heading="We preserve their voice"
            subtext="Upload any recording — a voicemail, vows, a bedtime story. We wrap it in an original score composed just for them."
            examples="· Voicemail · Vows · Bedtime stories · Deployment recordings"
            price="From $49"
            cta="Choose Preserve"
            selected={order.tier === "preserve"}
            onSelect={() => handleSelectTier("preserve")}
          />
        </div>
      </Step>

      {/* STEP 2 — placeholder anchor; content will be built next */}
      <div ref={step2Ref}>
        {order.tier && (
          <section className="container py-16 md:py-20">
            <p className="font-serif text-gold text-2xl md:text-3xl">02</p>
            <h2 className="font-serif text-3xl md:text-4xl text-navy mt-2">
              Choose their song
            </h2>
            <p className="text-muted-foreground mt-3">
              Coming next — branches based on{" "}
              <span className="text-navy font-medium">
                {order.tier === "signature" ? "Signature" : "Preserve"}
              </span>
              .
            </p>
          </section>
        )}
      </div>
    </main>
  );
};

// ----- Step shell ---------------------------------------------------------

const Step = ({
  index,
  title,
  subtitle,
  children,
}: {
  index: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <section className="container py-16 md:py-24">
    <div className="max-w-3xl mb-10 md:mb-12">
      <p className="font-serif text-gold text-2xl md:text-3xl mb-3">{index}</p>
      <h2 className="font-serif text-3xl md:text-5xl text-navy text-balance leading-[1.1]">
        {title}
      </h2>
      <p className="text-muted-foreground text-lg mt-4 text-balance">{subtitle}</p>
    </div>
    {children}
  </section>
);

// ----- Tier card ----------------------------------------------------------

const TierCard = ({
  label,
  heading,
  subtext,
  examples,
  price,
  cta,
  selected,
  onSelect,
}: {
  label: string;
  heading: string;
  subtext: string;
  examples: string;
  price: string;
  cta: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "relative text-left rounded-3xl bg-card p-7 md:p-9 border transition-all duration-300 flex flex-col",
      "hover:-translate-y-0.5 hover:shadow-card",
      selected
        ? "border-gold ring-2 ring-gold/40 shadow-card"
        : "border-border/60",
    )}
  >
    {selected && (
      <span className="absolute top-5 right-5 inline-flex items-center justify-center size-8 rounded-full bg-gold text-navy shadow-gold">
        <Check className="size-4" strokeWidth={3} />
      </span>
    )}

    <p className="label-eyebrow text-gold mb-4">{label}</p>
    <h3 className="font-serif text-2xl md:text-3xl text-navy leading-tight mb-3 text-balance pr-10">
      {heading}
    </h3>
    <p className="text-muted-foreground leading-relaxed mb-4">{subtext}</p>
    <p className="italic text-muted-foreground text-sm mb-7">{examples}</p>

    <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-border/60">
      <span className="font-serif text-lg text-navy">{price}</span>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5 h-11 text-sm font-medium transition-colors",
          selected
            ? "bg-gold text-navy"
            : "bg-navy text-cream group-hover:bg-navy-deep",
        )}
      >
        {cta}
      </span>
    </div>
  </button>
);

export default Start;
