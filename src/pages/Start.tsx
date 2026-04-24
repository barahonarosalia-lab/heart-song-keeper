import { forwardRef, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import luminaries from "@/assets/collection-luminaries.jpg";
import meadow from "@/assets/collection-meadow.jpg";
import fable from "@/assets/collection-fable.jpg";
import botanica from "@/assets/collection-botanica.jpg";
import ember from "@/assets/collection-ember.jpg";

// ----- Data ---------------------------------------------------------------

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
  {
    id: "luminaries",
    name: "Little Luminaries",
    img: luminaries,
    desc: "Soft, whimsical, and deeply loved. Anchored by Punch — the baby macaque who went viral for clinging to his stuffed orangutan.",
    mood: ["Gentle", "Playful", "Warm"],
  },
  {
    id: "meadow",
    name: "Meadow & Mane",
    img: meadow,
    desc: "Bold landscapes and animals that feel earned. Wide skies, golden fields, rugged wilderness.",
    mood: ["Strong", "Grounded", "Honest"],
  },
  {
    id: "fable",
    name: "Fable & Fawn",
    img: fable,
    desc: "Enchanted edge. Adult whimsy. Moonlit foxes, glowing cottages, botanical charm.",
    mood: ["Magical", "Soft", "Charming"],
  },
  {
    id: "botanica",
    name: "Moonlit Botanica",
    img: botanica,
    desc: "Dark florals, candlelight, and quiet reverence. Art that holds grief with dignity.",
    mood: ["Reverent", "Timeless", "Dignified"],
  },
  {
    id: "ember",
    name: "Ember & Ivy",
    img: ember,
    desc: "Warm, intimate, and romantic. Candlelit gardens, paired foxes, cottage roses.",
    mood: ["Romantic", "Cozy", "Chosen"],
  },
];

type ProductId = "digital" | "canvas" | "ornament" | "jewelry" | "blanket" | "photo-blanket";

interface Product {
  id: ProductId;
  name: string;
  startingPrice: number;
  priceLabel: string;
  tagline: string;
  details: string[];
  cta: string;
}

const products: Product[] = [
  {
    id: "digital",
    name: "Digital Download",
    startingPrice: 29,
    priceLabel: "From $29",
    tagline: "Instant. Printable. Frameable.",
    details: [
      "Delivered to inbox instantly",
      "High resolution PNG + PDF",
      "Print at home or any print shop",
      "QR code embedded in art",
      "Free shipping",
    ],
    cta: "Choose Digital",
  },
  {
    id: "canvas",
    name: "Canvas Print 11x14",
    startingPrice: 79,
    priceLabel: "From $79",
    tagline: "Gallery wrap. Ready to hang.",
    details: ["Ships in 4-6 business days", "Free shipping", "Add digital copy +$10"],
    cta: "Choose Canvas",
  },
  {
    id: "ornament",
    name: "Acrylic Ornament",
    startingPrice: 59,
    priceLabel: "From $59",
    tagline: "A keepsake that plays their song every time they hold it.",
    details: ["Gift box included", "Ships in 5-7 business days", "Free shipping"],
    cta: "Choose Ornament",
  },
  {
    id: "jewelry",
    name: "Jewelry",
    startingPrice: 89,
    priceLabel: "From $89",
    tagline: "Worn every day. Scanned whenever they need it.",
    details: [
      "Heart · Circle · Dog Tag",
      "Silver or Gold",
      "Ships in 5-7 business days",
      "Free shipping",
    ],
    cta: "Choose Jewelry",
  },
  {
    id: "blanket",
    name: "Sherpa Blanket",
    startingPrice: 119,
    priceLabel: "From $119",
    tagline: "Wrap up. Press play. They're there.",
    details: [
      "50x60 · Full color · Soft sherpa",
      "Ships in 3-5 business days",
      "Free shipping",
    ],
    cta: "Choose Blanket",
  },
  {
    id: "photo-blanket",
    name: "Photo Blanket",
    startingPrice: 119,
    priceLabel: "From $119",
    tagline: "Their photo. On something they'll hold forever.",
    details: [
      "Upload any photo",
      "50x60 · Full color · Soft sherpa",
      "Ships in 3-5 business days",
      "Free shipping",
    ],
    cta: "Choose Photo Blanket",
  },
];

const ornamentDesigns = [
  {
    id: "botanica",
    name: "Moonlit Botanica",
    sub: "Navy rose botanical wreath",
    use: "For memorial, grief, and remembrance moments",
    img: botanica,
    available: true,
  },
  {
    id: "luminaries",
    name: "Little Luminaries",
    sub: "Gold circle watercolor",
    use: "For baby, new arrival, and lullaby moments",
    img: luminaries,
    available: true,
  },
  {
    id: "pet",
    name: "Pet Memorial",
    sub: "Warm amber botanicals",
    use: "For beloved pets who were family",
    img: ember,
    available: true,
  },
  {
    id: "classic",
    name: "Classic Elegant",
    sub: "Silver pinecone wreath",
    use: "",
    img: fable,
    available: false,
  },
  {
    id: "colorful",
    name: "Colorful Celebration",
    sub: "Jewel tone botanicals",
    use: "",
    img: meadow,
    available: false,
  },
];

// Per-collection art tiles (placeholder — reuses collection image)
const artByCollection: Record<string, { id: string; img: string }[]> = Object.fromEntries(
  collections.map((c) => [
    c.id,
    Array.from({ length: 6 }).map((_, i) => ({ id: `${c.id}-${i + 1}`, img: c.img })),
  ]),
);

// ----- Helpers ------------------------------------------------------------

const findOccasion = (id: string | null) => occasions.find((o) => o.id === id);
const findCollection = (id: string | null) => collections.find((c) => c.id === id);
const findProduct = (id: string | null) => products.find((p) => p.id === id);
const findOrnament = (id: string | null) => ornamentDesigns.find((o) => o.id === id);

// ----- Page ---------------------------------------------------------------

type JewelryStyle = "heart" | "circle" | "dogtag";
type JewelryFinish = "silver" | "gold";

const jewelryStyles: { id: JewelryStyle; name: string }[] = [
  { id: "heart", name: "Heart" },
  { id: "circle", name: "Circle" },
  { id: "dogtag", name: "Dog Tag" },
];

const Start = () => {
  const navigate = useNavigate();

  const [occasion, setOccasion] = useState<string | null>(null);
  const [collection, setCollection] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductId | null>(null);
  const [art, setArt] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [artCollection, setArtCollection] = useState<string | null>(null);

  // Jewelry-specific state
  const [jewelryStyle, setJewelryStyle] = useState<JewelryStyle | null>(null);
  const [jewelryFinish, setJewelryFinish] = useState<JewelryFinish | null>(null);
  const [engravingLine1, setEngravingLine1] = useState("");
  const [engravingLine2, setEngravingLine2] = useState("");

  // Which step is currently expanded for editing (null = none open beyond what's unlocked)
  const [editingStep, setEditingStep] = useState<number | null>(1);

  const step1Done = !!occasion;
  const step2Done = !!collection;
  const step3Done = !!product;

  const selectedProduct = findProduct(product);
  const isPhoto = product === "photo-blanket";
  const isOrnament = product === "ornament";
  const isJewelry = product === "jewelry";

  // For jewelry, Step 4 is skipped entirely; jewelry config lives in Step 3.
  const jewelryConfigDone = !!jewelryStyle && !!jewelryFinish && engravingLine1.trim().length > 0;

  const step4Done = useMemo(() => {
    if (!product) return false;
    if (isJewelry) return true; // jewelry has no Step 4
    if (isPhoto) return !!photo;
    if (isOrnament) return !!art;
    return !!art;
  }, [product, photo, art, isPhoto, isOrnament, isJewelry]);

  // Total steps shown depends on product (jewelry skips Step 4)
  const totalSteps = isJewelry ? 3 : 4;

  const completedCount = isJewelry
    ? [step1Done, step2Done, step3Done && jewelryConfigDone].filter(Boolean).length
    : [step1Done, step2Done, step3Done, step4Done].filter(Boolean).length;
  const allDone = isJewelry
    ? step1Done && step2Done && step3Done && jewelryConfigDone
    : completedCount === totalSteps;

  // refs for scroll
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollToStep = (n: number) => {
    setTimeout(() => {
      stepRefs[n - 1].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Auto-advance
  const handleSelectOccasion = (id: string) => {
    setOccasion(id);
    setEditingStep(2);
    scrollToStep(2);
  };
  const handleSelectCollection = (id: string) => {
    setCollection(id);
    setArtCollection(id); // default art collection follows their choice
    setEditingStep(3);
    scrollToStep(3);
  };
  const handleSelectProduct = (id: ProductId) => {
    setProduct(id);
    // reset step 4 when switching product type
    setArt(null);
    setPhoto(null);
    // Reset jewelry-specific state when switching away from jewelry
    if (id !== "jewelry") {
      setJewelryStyle(null);
      setJewelryFinish(null);
      setEngravingLine1("");
      setEngravingLine2("");
    }
    // Jewelry has no Step 4 — keep editing on Step 3 so finish/engraving can reveal
    if (id === "jewelry") {
      setEditingStep(3);
      return;
    }
    setEditingStep(4);
    scrollToStep(4);
  };
  const handleSelectArt = (id: string) => {
    setArt(id);
    setEditingStep(null);
    setTimeout(() => {
      ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };
  const handleSelectOrnament = (id: string) => {
    setArt(id);
    setEditingStep(null);
    setTimeout(() => {
      ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  // Change handlers — clear everything after that step
  const changeStep = (n: number) => {
    if (n <= 1) {
      setCollection(null); setArtCollection(null); setProduct(null); setArt(null); setPhoto(null);
      setJewelryStyle(null); setJewelryFinish(null); setEngravingLine1(""); setEngravingLine2("");
    } else if (n === 2) {
      setProduct(null); setArt(null); setPhoto(null);
      setJewelryStyle(null); setJewelryFinish(null); setEngravingLine1(""); setEngravingLine2("");
    } else if (n === 3) {
      setArt(null); setPhoto(null);
    }
    setEditingStep(n);
    scrollToStep(n);
  };

  // Photo upload
  const handlePhoto = (file: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhoto(e.target?.result as string);
      setEditingStep(null);
      setTimeout(() => ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    if (!allDone) return;
    const params = new URLSearchParams({
      occasion: occasion!,
      collection: collection!,
      product: product!,
      art: art ?? "",
    });
    let target = "/personalize/signature";
    if (isJewelry) {
      target = "/personalize/jewelry";
      params.set("jewelry_style", jewelryStyle ?? "");
      params.set("jewelry_finish", jewelryFinish ?? "");
      params.set("engraving_line_1", engravingLine1);
      if (engravingLine2) params.set("engraving_line_2", engravingLine2);
    } else if (isOrnament) target = "/personalize/ornament";
    navigate(`${target}?${params.toString()}`);
  };

  // Missing-step nudge text
  const missingText = !step1Done
    ? "choose the occasion"
    : !step2Done
    ? "choose a collection"
    : !step3Done
    ? "choose how to give it"
    : isJewelry && !jewelryConfigDone
    ? !jewelryStyle
      ? "pick a jewelry style"
      : !jewelryFinish
      ? "pick silver or gold"
      : "add an engraving"
    : !step4Done
    ? isPhoto
      ? "upload their photo"
      : isOrnament
      ? "pick an ornament design"
      : "pick the art"
    : null;

  // Currently displayed step number for header
  const currentStep = !step1Done
    ? 1
    : !step2Done
    ? 2
    : !step3Done
    ? 3
    : isJewelry
    ? 3
    : !step4Done
    ? 4
    : 4;

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

          <div className="mt-10 max-w-md">
            <div className="flex items-center justify-between text-xs text-cream/60 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{completedCount}/{totalSteps} complete</span>
            </div>
            <div className="h-1 rounded-full bg-cream/10 overflow-hidden">
              <div
                className="h-full bg-gradient-gold transition-all duration-500"
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* STEP 1 */}
      <StepBlock
        ref={stepRefs[0]}
        index="01"
        title="What moment are you celebrating?"
        subtitle="Every occasion has its own song."
        unlocked
        complete={step1Done}
        collapsed={step1Done && editingStep !== 1}
        summary={step1Done ? `📍 ${findOccasion(occasion)?.name}` : ""}
        onChange={() => changeStep(1)}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {occasions.map((o) => {
            const selected = occasion === o.id;
            return (
              <button
                key={o.id}
                onClick={() => handleSelectOccasion(o.id)}
                className={cn(
                  "relative text-left p-5 md:p-6 rounded-2xl bg-card border transition-all duration-300",
                  "hover:-translate-y-0.5 hover:shadow-card",
                  selected ? "border-gold ring-2 ring-gold/40 shadow-card" : "border-border/60",
                )}
              >
                {selected && <SelectedDot />}
                <h3 className="font-serif text-lg md:text-xl text-navy leading-tight mb-1.5 pr-7">
                  {o.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-snug text-balance">{o.desc}</p>
              </button>
            );
          })}
        </div>
      </StepBlock>

      {/* STEP 2 */}
      <StepBlock
        ref={stepRefs[1]}
        index="02"
        title="Pick a card for your loved one."
        subtitle="This card arrives with their gift — or before it. It holds their personal message and their QR code. Choose the one that feels like them."
        unlocked={step1Done}
        complete={step2Done}
        collapsed={step2Done && editingStep !== 2}
        summary={step2Done ? `🎨 ${findCollection(collection)?.name}` : ""}
        onChange={() => changeStep(2)}
        pulse={step1Done && !step2Done}
      >
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {collections.map((c) => {
            const selected = collection === c.id;
            return (
              <article
                key={c.id}
                className={cn(
                  "group relative bg-card rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col",
                  "hover:-translate-y-0.5 hover:shadow-card",
                  selected ? "border-gold ring-2 ring-gold/40 shadow-card" : "border-border/60",
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
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-2xl text-navy mb-2">{c.name}</h3>
                  <p className="text-[15px] text-muted-foreground mb-4 leading-relaxed">{c.desc}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-6">
                    {c.mood.map((m) => (
                      <span key={m} className="text-xs tracking-[0.2em] uppercase text-gold font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant={selected ? "gold" : "navy"}
                    className="w-full mt-auto"
                    onClick={() => handleSelectCollection(c.id)}
                  >
                    {selected ? "Selected" : "Choose this collection"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Why the card matters */}
        <div className="mt-16 md:mt-20 pt-12 md:pt-14 border-t border-gold/30">
          <h3 className="font-serif text-xl md:text-2xl text-navy mb-8 md:mb-10 text-center">
            Why the card matters
          </h3>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
            <div className="text-center md:text-left">
              <div className="text-3xl mb-3">📬</div>
              <p className="label-eyebrow text-gold mb-2">It arrives first</p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                For jewelry and ornament orders — your card ships separately and arrives
                before their gift. They know something beautiful is coming.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl mb-3">✍️</div>
              <p className="label-eyebrow text-gold mb-2">Written just for them</p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                We write a personal message using the details you share. Or use your own
                words — we'll make them shine.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl mb-3">🔑</div>
              <p className="label-eyebrow text-gold mb-2">The QR lives here</p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Scan the card. Hear their song. The card is where the magic starts —
                and where it stays forever.
              </p>
            </div>
          </div>
          <p className="mt-10 md:mt-12 text-center text-sm text-muted-foreground/80 leading-relaxed max-w-xl mx-auto">
            Every Key of Hearts includes a premium 5x7 card. Printed on thick matte
            stock. Frameable. Keepsake quality. Included with every order — even digital.
          </p>
        </div>
      </StepBlock>

      {/* STEP 3 */}
      <StepBlock
        ref={stepRefs[2]}
        index="03"
        title="What would you like to gift them?"
        subtitle={
          <>
            Free shipping on every US order.
            <br />
            🌍 International customers pay shipping — shown before payment.
          </>
        }
        unlocked={step2Done}
        complete={step3Done}
        collapsed={step3Done && editingStep !== 3}
        summary={
          step3Done
            ? `🎁 ${selectedProduct?.name} · ${selectedProduct?.priceLabel}`
            : ""
        }
        onChange={() => changeStep(3)}
        pulse={step2Done && !step3Done}
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
                  selected ? "border-gold ring-2 ring-gold/40 shadow-card" : "border-border/60",
                )}
              >
                {selected && <SelectedDot />}
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
                  onClick={() => handleSelectProduct(p.id)}
                >
                  {selected ? "Selected" : p.cta}
                </Button>
              </article>
            );
          })}
        </div>

        {selectedProduct && (
          <div className="mt-10 text-center animate-fade-up">
            <p className="font-serif text-2xl md:text-3xl text-gold">
              Your Key of Hearts starts at ${selectedProduct.startingPrice}
            </p>
            <p className="text-sm text-muted-foreground mt-2">+ $20 for Preserve a Voice</p>
          </div>
        )}
      </StepBlock>

      {/* STEP 4 */}
      <StepBlock
        ref={stepRefs[3]}
        index="04"
        title="Choose the art for your gift."
        subtitle="This is the image that will be placed on your product."
        unlocked={step3Done}
        complete={step4Done}
        collapsed={step4Done && editingStep !== 4}
        summary={
          step4Done
            ? isPhoto
              ? "🖼 Photo uploaded"
              : isOrnament
              ? `🖼 ${findOrnament(art)?.name}`
              : `🖼 ${findCollection(artCollection)?.name} art`
            : ""
        }
        onChange={() => changeStep(4)}
        pulse={step3Done && !step4Done}
      >
        {/* Variant: ornament */}
        {isOrnament && (
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {ornamentDesigns.map((d) => {
              const selected = art === d.id;
              const disabled = !d.available;
              return (
                <article
                  key={d.id}
                  className={cn(
                    "relative bg-card rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col",
                    !disabled && "hover:-translate-y-0.5 hover:shadow-card",
                    selected ? "border-gold ring-2 ring-gold/40 shadow-card" : "border-border/60",
                    disabled && "opacity-60",
                  )}
                >
                  {selected && (
                    <span className="absolute top-4 right-4 z-10 size-8 rounded-full bg-gold text-navy flex items-center justify-center shadow-soft">
                      <Check className="size-5" strokeWidth={3} />
                    </span>
                  )}
                  <div className={cn("aspect-[16/10] overflow-hidden bg-muted", disabled && "grayscale")}>
                    <img src={d.img} alt={d.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-2xl text-navy mb-1">{d.name}</h3>
                    <p className="text-[15px] text-navy/70 mb-2">{d.sub}</p>
                    {d.use && <p className="text-sm text-muted-foreground mb-5">{d.use}</p>}
                    {disabled ? (
                      <span className="mt-auto inline-flex items-center justify-center text-xs label-eyebrow text-gold border border-gold/40 rounded-full py-3">
                        Coming Soon
                      </span>
                    ) : (
                      <Button
                        variant={selected ? "gold" : "navy"}
                        className="w-full mt-auto"
                        onClick={() => handleSelectOrnament(d.id)}
                      >
                        {selected ? "Selected" : "Choose this design"}
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Variant: photo upload */}
        {isPhoto && (
          <PhotoUpload photo={photo} onFile={handlePhoto} onClear={() => setPhoto(null)} />
        )}

        {/* Variant: art grid (digital, canvas, blanket, jewelry) */}
        {!isOrnament && !isPhoto && product && (
          <ArtPicker
            currentCollectionId={artCollection ?? collection!}
            onChangeCollection={(id) => {
              setArtCollection(id);
              setArt(null);
            }}
            selectedArt={art}
            onSelectArt={handleSelectArt}
            note={
              isJewelry
                ? "This art appears on their personalized card — included with every order."
                : "Can't find exactly what you want? More art added regularly."
            }
            limit={isJewelry ? 6 : undefined}
          />
        )}
      </StepBlock>

      {/* CONTINUE */}
      <div ref={ctaRef} className="container pb-32 pt-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          {!allDone && missingText && (
            <p className="text-gold text-sm md:text-base">
              Just one more step — {missingText} to continue
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
          {!isJewelry && !isOrnament && (
            <p className="text-xs text-muted-foreground">
              You'll choose Signature song or Preserve a Voice on the next page
            </p>
          )}
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

// ----- Sub-components -----------------------------------------------------

const SelectedDot = () => (
  <span className="absolute top-3 right-3 size-6 rounded-full bg-gold text-navy flex items-center justify-center">
    <Check className="size-4" strokeWidth={3} />
  </span>
);

interface StepBlockProps {
  index: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  unlocked: boolean;
  complete: boolean;
  collapsed: boolean;
  summary?: string;
  onChange?: () => void;
  pulse?: boolean;
  children: React.ReactNode;
}

const StepBlock = forwardRef<HTMLDivElement, StepBlockProps>(function StepBlock(
  { index, title, subtitle, unlocked, complete, collapsed, summary, onChange, pulse, children },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn(
        "container py-12 md:py-20 scroll-mt-24 transition-opacity duration-500",
        !unlocked && "opacity-40 pointer-events-none select-none",
      )}
    >
      {collapsed ? (
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 p-5 md:p-6 rounded-2xl bg-card border border-gold/40 shadow-soft">
          <div className="flex items-center gap-4 min-w-0">
            <span className="font-serif text-xl text-gold shrink-0">{index}</span>
            <span className="size-6 rounded-full bg-gold text-navy flex items-center justify-center shrink-0">
              <Check className="size-4" strokeWidth={3} />
            </span>
            <p className="font-serif text-lg md:text-xl text-navy truncate">{summary}</p>
          </div>
          <button
            onClick={onChange}
            className="text-sm text-gold hover:text-navy transition-colors underline-offset-4 hover:underline shrink-0"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <div className={cn("max-w-2xl mb-8 md:mb-10", pulse && "animate-pulse-border-init")}>
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
        </>
      )}
    </section>
  );
});

// ArtPicker -----------------------------------------------------------------

const ArtPicker = ({
  currentCollectionId,
  onChangeCollection,
  selectedArt,
  onSelectArt,
  note,
  limit,
}: {
  currentCollectionId: string;
  onChangeCollection: (id: string) => void;
  selectedArt: string | null;
  onSelectArt: (id: string) => void;
  note: string;
  limit?: number;
}) => {
  const [open, setOpen] = useState(false);
  const current = findCollection(currentCollectionId) ?? collections[0];
  const tiles = (artByCollection[current.id] ?? []).slice(0, limit ?? undefined);

  return (
    <div>
      {/* Collection switcher */}
      <div className="relative inline-block mb-6">
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/60 hover:border-gold transition-colors text-sm"
        >
          <span className="text-muted-foreground">Showing:</span>
          <span className="font-serif text-navy">{current.name}</span>
          <ChevronDown className={cn("size-4 text-gold transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="absolute z-20 mt-2 left-0 min-w-[16rem] rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
            {collections.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onChangeCollection(c.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3",
                  c.id === current.id && "text-gold",
                )}
              >
                <span className="font-serif text-base">{c.name}</span>
                {c.id === current.id && <Check className="size-4" strokeWidth={3} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid (desktop) / horizontal scroll (mobile) */}
      <div className="md:grid md:grid-cols-3 md:gap-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
        {tiles.map((t) => {
          const selected = selectedArt === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectArt(t.id)}
              className={cn(
                "relative group rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 snap-center",
                "w-[80vw] md:w-auto aspect-square",
                selected
                  ? "border-gold ring-2 ring-gold/40 shadow-card"
                  : "border-transparent hover:border-gold/60",
              )}
            >
              <img src={t.img} alt="" className="w-full h-full object-cover" loading="lazy" />
              {selected && (
                <span className="absolute top-3 right-3 size-8 rounded-full bg-gold text-navy flex items-center justify-center shadow-soft">
                  <Check className="size-5" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted-foreground text-center md:text-left">{note}</p>
    </div>
  );
};

// PhotoUpload --------------------------------------------------------------

const PhotoUpload = ({
  photo,
  onFile,
  onClear,
}: {
  photo: string | null;
  onFile: (file: File | null) => void;
  onClear: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  if (photo) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-card border border-gold/40 shadow-card">
          <img src={photo} alt="Uploaded" className="w-full max-h-[60vh] object-contain bg-navy/5" />
          <button
            onClick={onClear}
            className="absolute top-4 right-4 size-9 rounded-full bg-cream/90 hover:bg-cream text-navy flex items-center justify-center shadow-soft"
            aria-label="Remove photo"
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="font-serif italic text-xl text-navy text-center mt-6">
          Looking good. Let's keep going.
        </p>
        <p className="text-sm text-muted-foreground text-center mt-4 max-w-lg mx-auto">
          Their photo prints full bleed on premium sherpa. A QR code sits in the corner — scan it to
          hear their song or voice.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "block cursor-pointer rounded-2xl border-2 border-dashed p-12 md:p-16 text-center bg-card transition-all duration-300",
          drag ? "border-gold bg-gold/5" : "border-border hover:border-gold/60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        <Upload className="size-10 text-gold mx-auto mb-5" />
        <p className="font-serif text-xl md:text-2xl text-navy mb-2">Upload their photo</p>
        <p className="text-sm text-muted-foreground mb-1">JPG · PNG · Max 10MB</p>
        <p className="text-sm text-muted-foreground">
          Best results: clear subject, good lighting, high resolution
        </p>
      </label>
      <p className="text-sm text-muted-foreground text-center mt-6 max-w-lg mx-auto">
        Their photo prints full bleed on premium sherpa. A QR code sits in the corner — scan it to
        hear their song or voice.
      </p>
    </div>
  );
};

export default Start;
