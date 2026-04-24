import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Info, Play, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import luminaries from "@/assets/collection-luminaries.jpg";
import meadow from "@/assets/collection-meadow.jpg";
import fable from "@/assets/collection-fable.jpg";
import botanica from "@/assets/collection-botanica.jpg";
import ember from "@/assets/collection-ember.jpg";

// ----- Types --------------------------------------------------------------

type Tier = "signature" | "preserve";
type SongVersion = "instrumental" | "humming" | "with_lyrics";
type ProductId = "digital" | "canvas" | "ornament" | "jewelry" | "blanket";
type JewelryStyle = "heart" | "circle" | "dog_tag";
type JewelryFinish = "silver" | "gold";

interface OrderState {
  tier: Tier | null;
  occasion: string | null;
  song_version: SongVersion | null;
  whose_audio: string;
  music_style: string | null;
  audio_url: string;
  send_link_later: boolean;
  audio_consent: boolean;
  audio_consent_at: string | null;
  product: ProductId | null;
  ornament_design: string | null;
  ornament_dedication: string;
  ornament_year: string;
  ornament_line_1: string;
  ornament_line_2: string;
  jewelry_style: JewelryStyle | null;
  jewelry_finish: JewelryFinish | null;
  engraving_line_1: string;
  engraving_line_2: string;
  collection: string | null;
  art_selected: string | null;
}

const SONG_VERSIONS: { value: SongVersion; label: string; title: string }[] = [
  { value: "instrumental", label: "INSTRUMENTAL", title: "Song 1" },
  { value: "humming", label: "HUMMING", title: "Song 2" },
  { value: "with_lyrics", label: "WITH LYRICS", title: "Song 3" },
];

const OCCASIONS = [
  "Memorial & Remembrance",
  "Pregnancy & Infant Loss",
  "Pet Memorial",
  "Wedding & Anniversary",
  "Birth & Baby",
  "Birthday",
  "Mother's Day",
  "Father's Day",
  "Military & Deployment",
  "Graduation",
  "Sobriety & Milestone",
  "Friendship",
  "Just Because",
  "Childhood Memory",
  "Holiday & Christmas",
];

const MUSIC_STYLES = [
  "Soft Piano",
  "Gentle Strings",
  "Acoustic Guitar",
  "Ambient Warmth",
  "Lullaby",
  "Soft Choir",
  "Celtic & Folk",
  "No Background Music",
];

// ----- Product pricing ----------------------------------------------------

interface ProductDef {
  id: ProductId;
  name: string;
  signature: number;
  preserve: number;
  tagline: string;
  details: string[];
  cta: string;
}

const PRODUCTS: ProductDef[] = [
  {
    id: "digital",
    name: "Digital Download",
    signature: 29,
    preserve: 49,
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
    name: "Canvas — Unframed 11x14",
    signature: 79,
    preserve: 99,
    tagline: "Hang it. Scan it. Feel it again.",
    details: [
      "Ships in 3-5 business days",
      "Gift-ready packaging",
      "QR code embedded in art",
      "Free shipping",
    ],
    cta: "Choose Canvas",
  },
  {
    id: "ornament",
    name: "Acrylic Ornament",
    signature: 59,
    preserve: 79,
    tagline: "Scan to unwrap.",
    details: [
      "Gift box included",
      "Ships in 5-7 business days",
      "Free shipping",
    ],
    cta: "Choose Ornament",
  },
  {
    id: "jewelry",
    name: "Jewelry — Heart · Circle · Dog Tag",
    signature: 89,
    preserve: 109,
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
    name: "Blanket",
    signature: 119,
    preserve: 139,
    tagline: "Wrapped in it. Every night.",
    details: [
      "Sherpa 50x60",
      "QR code woven into art",
      "Ships in 3-5 business days",
      "Free shipping",
    ],
    cta: "Choose Blanket",
  },
];

interface OrnamentDesign {
  id: string;
  name: string;
  descriptor: string;
  comingSoon?: boolean;
}

const ORNAMENT_DESIGNS: OrnamentDesign[] = [
  { id: "moonlit_botanica", name: "Moonlit Botanica", descriptor: "Navy rose botanical wreath" },
  { id: "little_luminaries", name: "Little Luminaries", descriptor: "Gold circle watercolor" },
  { id: "pet_memorial", name: "Pet Memorial", descriptor: "Autumn botanical wreath" },
  { id: "classic_elegant", name: "Classic & Elegant", descriptor: "Silver pinecone", comingSoon: true },
  { id: "colorful_celebration", name: "Colorful Celebration", descriptor: "Jewel tones", comingSoon: true },
];

const JEWELRY_STYLES: { id: JewelryStyle; name: string }[] = [
  { id: "heart", name: "Heart" },
  { id: "circle", name: "Circle" },
  { id: "dog_tag", name: "Dog Tag" },
];

// ----- Collections (art) --------------------------------------------------

interface ArtPiece {
  id: string;
  name: string;
}

interface CollectionDef {
  id: string;
  name: string;
  cover: string;
  pieces: ArtPiece[];
}

const COLLECTIONS: CollectionDef[] = [
  {
    id: "little_luminaries",
    name: "Little Luminaries",
    cover: luminaries,
    pieces: [
      { id: "punch_lullaby", name: "Punch & Lullaby" },
      { id: "first_breath", name: "First Breath" },
      { id: "moonlit_crib", name: "Moonlit Crib" },
      { id: "tiny_hands", name: "Tiny Hands" },
    ],
  },
  {
    id: "moonlit_botanica",
    name: "Moonlit Botanica",
    cover: botanica,
    pieces: [
      { id: "candlelit_wreath", name: "Candlelit Wreath" },
      { id: "evening_rose", name: "Evening Rose" },
      { id: "quiet_reverence", name: "Quiet Reverence" },
      { id: "midnight_garden", name: "Midnight Garden" },
    ],
  },
  {
    id: "meadow_mane",
    name: "Meadow & Mane",
    cover: meadow,
    pieces: [
      { id: "wide_skies", name: "Wide Skies" },
      { id: "golden_field", name: "Golden Field" },
      { id: "rugged_ridge", name: "Rugged Ridge" },
      { id: "lone_stag", name: "Lone Stag" },
    ],
  },
  {
    id: "fable_fawn",
    name: "Fable & Fawn",
    cover: fable,
    pieces: [
      { id: "moonlit_fox", name: "Moonlit Fox" },
      { id: "glowing_cottage", name: "Glowing Cottage" },
      { id: "enchanted_grove", name: "Enchanted Grove" },
      { id: "starlit_path", name: "Starlit Path" },
    ],
  },
  {
    id: "ember_ivy",
    name: "Ember & Ivy",
    cover: ember,
    pieces: [
      { id: "candlelit_garden", name: "Candlelit Garden" },
      { id: "paired_foxes", name: "Paired Foxes" },
      { id: "cottage_roses", name: "Cottage Roses" },
      { id: "warm_hearth", name: "Warm Hearth" },
    ],
  },
];

// Map an occasion (Step 2) to a default collection (Step 4)
const OCCASION_TO_COLLECTION: Record<string, string> = {
  "Birth & Baby": "little_luminaries",
  "Mother's Day": "little_luminaries",
  "Father's Day": "meadow_mane",
  "Memorial & Remembrance": "moonlit_botanica",
  "Pregnancy & Infant Loss": "moonlit_botanica",
  "Pet Memorial": "moonlit_botanica",
  "Military & Deployment": "meadow_mane",
  "Graduation": "meadow_mane",
  "Sobriety & Milestone": "meadow_mane",
  "Childhood Memory": "meadow_mane",
  "Birthday": "meadow_mane",
  "Just Because": "meadow_mane",
  "Friendship": "fable_fawn",
  "Wedding & Anniversary": "ember_ivy",
  "Holiday & Christmas": "fable_fawn",
};

// Map a product to the Step 4 headline noun
const PRODUCT_TO_ART_NOUN: Partial<Record<ProductId, string>> = {
  canvas: "canvas",
  blanket: "blanket",
  digital: "digital download",
};

// Products that route through the art-picker step
const ART_PRODUCTS: ProductId[] = ["canvas", "blanket", "digital"];

// ----- Page ---------------------------------------------------------------

const Start = () => {
  const [order, setOrder] = useState<OrderState>({
    tier: null,
    occasion: null,
    song_version: null,
    whose_audio: "",
    music_style: null,
    audio_url: "",
    send_link_later: false,
    audio_consent: false,
    audio_consent_at: null,
    product: null,
    ornament_design: null,
    ornament_dedication: "",
    ornament_year: "",
    ornament_line_1: "",
    ornament_line_2: "",
    jewelry_style: null,
    jewelry_finish: null,
    engraving_line_1: "",
    engraving_line_2: "",
    collection: null,
    art_selected: null,
  });

  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleSelectTier = (tier: Tier) => {
    setOrder((prev) => ({ ...prev, tier }));
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const handleSelectOccasion = (occasion: string) => {
    setOrder((prev) => ({ ...prev, occasion, song_version: null }));
  };

  const handleChangeOccasion = () => {
    setOrder((prev) => ({ ...prev, occasion: null, song_version: null }));
  };

  // Reveal details once an occasion is picked
  useEffect(() => {
    if (order.occasion && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, [order.occasion]);

  const handleConsentChange = (checked: boolean) => {
    setOrder((prev) => ({
      ...prev,
      audio_consent: checked,
      audio_consent_at: checked ? new Date().toISOString() : null,
    }));
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOrder((prev) => ({ ...prev, audio_url: url }));
  };

  const handleSelectProduct = (product: ProductId) => {
    setOrder((prev) => ({
      ...prev,
      product,
      // Reset sub-selections when switching products
      ornament_design: product === "ornament" ? prev.ornament_design : null,
      ornament_dedication: product === "ornament" ? prev.ornament_dedication : "",
      ornament_year: product === "ornament" ? prev.ornament_year : "",
      ornament_line_1: product === "ornament" ? prev.ornament_line_1 : "",
      ornament_line_2: product === "ornament" ? prev.ornament_line_2 : "",
      jewelry_style: product === "jewelry" ? prev.jewelry_style : null,
      jewelry_finish: product === "jewelry" ? prev.jewelry_finish : null,
      engraving_line_1: product === "jewelry" ? prev.engraving_line_1 : "",
      engraving_line_2: product === "jewelry" ? prev.engraving_line_2 : "",
    }));
  };

  // Determine if Step 2 is complete enough to unlock Step 3
  const step2Complete =
    order.tier === "signature"
      ? !!order.song_version
      : order.tier === "preserve"
      ? !!order.occasion &&
        !!order.whose_audio.trim() &&
        !!order.music_style &&
        (order.send_link_later || !!order.audio_url) &&
        order.audio_consent
      : false;

  // Reveal Step 3 once Step 2 is complete
  useEffect(() => {
    if (step2Complete && step3Ref.current) {
      setTimeout(() => {
        step3Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [step2Complete]);

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

      {/* STEP 2 — Preserve path */}
      <div ref={step2Ref}>
        {order.tier === "preserve" && (
          <Step
            index="02"
            title="What moment are you celebrating?"
            subtitle="Every voice deserves the right setting."
          >
            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl">
              {OCCASIONS.map((occ) => (
                <OccasionCard
                  key={occ}
                  label={occ}
                  selected={order.occasion === occ}
                  onSelect={() => handleSelectOccasion(occ)}
                />
              ))}
            </div>

            {order.occasion && (
              <div
                ref={detailsRef}
                className="max-w-3xl mt-12 md:mt-16 space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                {/* Whose voice */}
                <div className="space-y-3">
                  <label htmlFor="whose-audio" className="label-eyebrow text-gold block">
                    Whose voice or audio is this?
                  </label>
                  <Input
                    id="whose-audio"
                    value={order.whose_audio}
                    onChange={(e) =>
                      setOrder((prev) => ({ ...prev, whose_audio: e.target.value }))
                    }
                    placeholder="e.g. My grandmother Ruth, our dog Cooper"
                    className="h-12 rounded-xl bg-card border-border/60 text-base"
                  />
                </div>

                {/* Music style */}
                <div className="space-y-4">
                  <p className="label-eyebrow text-gold">Background music style</p>
                  <div className="flex flex-wrap gap-2.5">
                    {MUSIC_STYLES.map((style) => {
                      const selected = order.music_style === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() =>
                            setOrder((prev) => ({ ...prev, music_style: style }))
                          }
                          className={cn(
                            "rounded-full px-4 h-10 text-sm font-medium border transition-all",
                            selected
                              ? "bg-gold text-navy border-gold shadow-gold"
                              : "bg-card text-navy border-border/60 hover:border-gold hover:text-navy",
                          )}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Audio upload */}
                <div className="space-y-4">
                  <p className="label-eyebrow text-gold">Upload their audio</p>
                  <label
                    htmlFor="audio-file"
                    className={cn(
                      "block rounded-2xl border-2 border-dashed p-8 md:p-10 text-center cursor-pointer transition-all bg-card/50",
                      order.audio_url
                        ? "border-gold bg-gold/5"
                        : "border-border hover:border-gold hover:bg-gold/5",
                      order.send_link_later && "opacity-60",
                    )}
                  >
                    <input
                      id="audio-file"
                      type="file"
                      accept="audio/mpeg,audio/wav,audio/x-m4a,audio/mp4,.mp3,.wav,.m4a"
                      className="sr-only"
                      onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                    />
                    <div className="flex flex-col items-center gap-3">
                      <span className="inline-flex items-center justify-center size-12 rounded-full bg-gold/15 text-gold">
                        <UploadCloud className="size-6" />
                      </span>
                      {order.audio_url ? (
                        <>
                          <p className="font-serif text-lg text-navy">Audio ready</p>
                          <p className="text-sm text-muted-foreground">Click to replace</p>
                        </>
                      ) : (
                        <>
                          <p className="font-serif text-lg text-navy">Upload their audio</p>
                          <p className="text-sm text-muted-foreground">
                            MP3 · WAV · M4A · up to 50MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <Checkbox
                      checked={order.send_link_later}
                      onCheckedChange={(checked) =>
                        setOrder((prev) => ({
                          ...prev,
                          send_link_later: checked === true,
                        }))
                      }
                      className="mt-0.5 border-navy/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-navy"
                    />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      I'm not ready yet — send me an upload link after checkout.
                    </span>
                  </label>
                </div>

                {/* Legal consent */}
                <div className="rounded-2xl bg-card border border-border/60 p-5 md:p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={order.audio_consent}
                      onCheckedChange={(checked) => handleConsentChange(checked === true)}
                      required
                      className="mt-0.5 border-navy/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-navy"
                    />
                    <span className="text-sm text-navy leading-relaxed">
                      I confirm I have the right to upload this audio and agree to the{" "}
                      <a
                        href="/terms/audio-upload"
                        className="underline decoration-gold/60 underline-offset-2 hover:text-gold"
                      >
                        Key of Hearts Audio Upload Terms
                      </a>
                      .
                    </span>
                  </label>
                </div>
              </div>
            )}
          </Step>
        )}

        {/* STEP 2 — Signature path */}
        {order.tier === "signature" && (
          <Step
            index="02"
            title="What moment are you celebrating?"
            subtitle="Every occasion has its own song."
          >
            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl">
              {OCCASIONS.map((occ) => (
                <OccasionCard
                  key={occ}
                  label={occ}
                  selected={order.occasion === occ}
                  onSelect={() => handleSelectOccasion(occ)}
                />
              ))}
            </div>

            {order.occasion && (
              <div
                ref={detailsRef}
                className="max-w-5xl mt-12 md:mt-16 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <button
                  type="button"
                  onClick={handleChangeOccasion}
                  className="text-xs text-muted-foreground hover:text-gold underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-gold transition-colors mb-6"
                >
                  Change occasion
                </button>

                <div className="grid md:grid-cols-3 gap-5 md:gap-6">
                  {SONG_VERSIONS.map((song) => (
                    <SongCard
                      key={song.value}
                      label={song.label}
                      title={song.title}
                      selected={order.song_version === song.value}
                      onSelect={() =>
                        setOrder((prev) => ({ ...prev, song_version: song.value }))
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </Step>
        )}
      </div>

      {/* STEP 3 — Choose their gift */}
      <div ref={step3Ref}>
        {step2Complete && (
          <Step
            index="03"
            title="What would you like to gift them?"
            subtitle="Free shipping on every US order. 🌍 International customers pay shipping — shown before payment."
          >
            <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  tier={order.tier!}
                  selected={order.product === product.id}
                  onSelect={() => handleSelectProduct(product.id)}
                  order={order}
                  setOrder={setOrder}
                />
              ))}
            </div>
          </Step>
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
      selected ? "border-gold ring-2 ring-gold/40 shadow-card" : "border-border/60",
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
          selected ? "bg-gold text-navy" : "bg-navy text-cream group-hover:bg-navy-deep",
        )}
      >
        {cta}
      </span>
    </div>
  </button>
);

// ----- Occasion card ------------------------------------------------------

const OccasionCard = ({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "relative text-left rounded-2xl bg-card p-4 md:p-5 border transition-all duration-200 min-h-[72px] flex items-center pr-10",
      "hover:-translate-y-0.5 hover:border-gold hover:shadow-soft",
      selected ? "border-gold ring-2 ring-gold/40 shadow-soft" : "border-border/60",
    )}
  >
    <span className="font-serif text-base md:text-lg text-navy leading-snug text-balance">
      {label}
    </span>
    {selected && (
      <span className="absolute top-3 right-3 inline-flex items-center justify-center size-6 rounded-full bg-gold text-navy">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    )}
  </button>
);

// ----- Song card ----------------------------------------------------------

const SongCard = ({
  label,
  title,
  selected,
  onSelect,
}: {
  label: string;
  title: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <div
    className={cn(
      "relative rounded-2xl bg-card p-6 border transition-all duration-300 flex flex-col",
      selected ? "border-gold ring-2 ring-gold/40 shadow-card" : "border-border/60",
    )}
  >
    {selected && (
      <span className="absolute top-4 right-4 inline-flex items-center justify-center size-7 rounded-full bg-gold text-navy shadow-gold">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    )}

    <p className="label-eyebrow text-gold mb-3">{label}</p>
    <h3 className="font-serif text-xl md:text-2xl text-navy leading-tight mb-5 pr-8">
      {title}
    </h3>

    <div className="flex items-center gap-3 mb-6">
      <button
        type="button"
        aria-label={`Play ${title}`}
        className="inline-flex items-center justify-center size-11 rounded-full bg-navy text-cream hover:bg-navy-deep transition-colors flex-shrink-0"
      >
        <Play className="size-4 ml-0.5" fill="currentColor" />
      </button>
      <div className="flex-1 h-1.5 rounded-full bg-border/60 overflow-hidden">
        <div className="h-full w-0 bg-gold rounded-full" />
      </div>
    </div>

    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "mt-auto inline-flex items-center justify-center rounded-full h-11 px-5 text-sm font-medium border-2 transition-all",
        selected
          ? "bg-gold text-navy border-gold"
          : "bg-transparent text-navy border-gold hover:bg-gold/10",
      )}
    >
      {selected ? "Selected" : "Choose this song"}
    </button>
  </div>
);

// ----- Product card -------------------------------------------------------

const ProductCard = ({
  product,
  tier,
  selected,
  onSelect,
  order,
  setOrder,
}: {
  product: ProductDef;
  tier: Tier;
  selected: boolean;
  onSelect: () => void;
  order: OrderState;
  setOrder: React.Dispatch<React.SetStateAction<OrderState>>;
}) => {
  // Dynamic price for jewelry: gold finish adds $10
  const basePrice = tier === "signature" ? product.signature : product.preserve;
  const displayPrice =
    product.id === "jewelry" && order.jewelry_finish === "gold"
      ? basePrice + 10
      : basePrice;

  return (
    <div
      className={cn(
        "relative rounded-3xl bg-card p-7 md:p-9 border transition-all duration-300 flex flex-col",
        selected ? "border-gold ring-2 ring-gold/40 shadow-card" : "border-border/60",
      )}
    >
      {selected && (
        <span className="absolute top-5 right-5 inline-flex items-center justify-center size-8 rounded-full bg-gold text-navy shadow-gold z-10">
          <Check className="size-4" strokeWidth={3} />
        </span>
      )}

      <p className="label-eyebrow text-gold mb-2">FROM ${displayPrice}</p>
      <h3 className="font-serif text-2xl md:text-3xl text-navy leading-tight mb-2 text-balance pr-10">
        {product.name}
      </h3>
      <p className="italic text-muted-foreground mb-5">{product.tagline}</p>

      <ul className="space-y-2 mb-7 text-sm text-muted-foreground">
        {product.details.map((d) => (
          <li key={d} className="flex gap-2">
            <span className="text-gold">·</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      {!selected && (
        <button
          type="button"
          onClick={onSelect}
          className="mt-auto inline-flex items-center justify-center rounded-full h-11 px-5 text-sm font-medium bg-navy text-cream hover:bg-navy-deep transition-colors"
        >
          {product.cta}
        </button>
      )}

      {selected && product.id === "ornament" && (
        <OrnamentExpansion order={order} setOrder={setOrder} />
      )}

      {selected && product.id === "jewelry" && (
        <JewelryExpansion order={order} setOrder={setOrder} tier={tier} />
      )}

      {selected &&
        product.id !== "ornament" &&
        product.id !== "jewelry" && (
          <div className="mt-auto inline-flex items-center justify-center rounded-full h-11 px-5 text-sm font-medium bg-gold text-navy">
            Selected
          </div>
        )}
    </div>
  );
};

// ----- Ornament expansion -------------------------------------------------

const OrnamentExpansion = ({
  order,
  setOrder,
}: {
  order: OrderState;
  setOrder: React.Dispatch<React.SetStateAction<OrderState>>;
}) => {
  return (
    <div className="mt-2 pt-7 border-t border-border/60 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Design picker */}
      <div className="space-y-4">
        <p className="label-eyebrow text-gold">Choose your design</p>
        <div className="grid grid-cols-2 gap-3">
          {ORNAMENT_DESIGNS.map((design) => {
            const selected = order.ornament_design === design.id;
            const disabled = !!design.comingSoon;
            return (
              <button
                key={design.id}
                type="button"
                disabled={disabled}
                onClick={() =>
                  !disabled &&
                  setOrder((prev) => ({ ...prev, ornament_design: design.id }))
                }
                className={cn(
                  "relative text-left rounded-xl border p-3 transition-all min-h-[88px]",
                  disabled
                    ? "border-border/40 bg-muted/30 opacity-50 cursor-not-allowed"
                    : "bg-card hover:border-gold hover:shadow-soft cursor-pointer",
                  selected && !disabled
                    ? "border-gold ring-2 ring-gold/40"
                    : "border-border/60",
                )}
              >
                {selected && !disabled && (
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center size-5 rounded-full bg-gold text-navy">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
                <p className="font-serif text-sm md:text-base text-navy leading-tight pr-6">
                  {design.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {design.descriptor}
                  {disabled && " (coming soon)"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional fields appear once a design is selected */}
      {order.ornament_design && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {(order.ornament_design === "moonlit_botanica" || order.ornament_design === "pet_memorial") && (
            <>
              <div className="space-y-2">
                <label htmlFor="ornament-line-1" className="label-eyebrow text-gold block">
                  Line 1 (optional)
                </label>
                <Input
                  id="ornament-line-1"
                  maxLength={30}
                  value={order.ornament_line_1}
                  onChange={(e) =>
                    setOrder((prev) => ({ ...prev, ornament_line_1: e.target.value }))
                  }
                  placeholder={order.ornament_design === "moonlit_botanica" ? "e.g. His light shines on" : "e.g. Cooper"}
                  className="h-11 rounded-xl bg-cream border-border/60"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {order.ornament_line_1.length}/30
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="ornament-line-2" className="label-eyebrow text-gold block">
                  Line 2 (optional)
                </label>
                <Input
                  id="ornament-line-2"
                  maxLength={30}
                  value={order.ornament_line_2}
                  onChange={(e) =>
                    setOrder((prev) => ({ ...prev, ornament_line_2: e.target.value }))
                  }
                  placeholder={order.ornament_design === "moonlit_botanica" ? "e.g. Forever in our hearts" : "e.g. Best dog. Best friend."}
                  className="h-11 rounded-xl bg-cream border-border/60"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {order.ornament_line_2.length}/30
                </p>
              </div>
            </>
          )}

          {order.ornament_design === "little_luminaries" && (
            <>
              <div className="space-y-2">
                <label htmlFor="ornament-year" className="label-eyebrow text-gold block">
                  Year (optional)
                </label>
                <Input
                  id="ornament-year"
                  inputMode="numeric"
                  maxLength={4}
                  value={order.ornament_year}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                    setOrder((prev) => ({ ...prev, ornament_year: v }));
                  }}
                  placeholder="e.g. 2026"
                  className="h-11 rounded-xl bg-cream border-border/60"
                />
                <p className="text-xs text-muted-foreground italic">
                  Add the year they arrived — optional but special.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="ornament-dedication" className="label-eyebrow text-gold block">
                  Dedication (optional)
                </label>
                <Input
                  id="ornament-dedication"
                  maxLength={30}
                  value={order.ornament_dedication}
                  onChange={(e) =>
                    setOrder((prev) => ({ ...prev, ornament_dedication: e.target.value }))
                  }
                  placeholder="e.g. Loved you before you arrived"
                  className="h-11 rounded-xl bg-cream border-border/60"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {order.ornament_dedication.length}/30
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ----- Jewelry expansion --------------------------------------------------

const JewelryExpansion = ({
  order,
  setOrder,
  tier,
}: {
  order: OrderState;
  setOrder: React.Dispatch<React.SetStateAction<OrderState>>;
  tier: Tier;
}) => {
  const silverPrice = tier === "signature" ? 89 : 109;
  const goldPrice = tier === "signature" ? 99 : 119;

  return (
    <div className="mt-2 pt-7 border-t border-border/60 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Style */}
      <div className="space-y-4">
        <p className="label-eyebrow text-gold">Choose your style</p>
        <div className="grid grid-cols-3 gap-3">
          {JEWELRY_STYLES.map((style) => {
            const selected = order.jewelry_style === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() =>
                  setOrder((prev) => ({ ...prev, jewelry_style: style.id }))
                }
                className={cn(
                  "relative rounded-xl border p-3 min-h-[64px] transition-all bg-card hover:border-gold",
                  selected
                    ? "border-gold ring-2 ring-gold/40"
                    : "border-border/60",
                )}
              >
                {selected && (
                  <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center size-5 rounded-full bg-gold text-navy">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
                <p className="font-serif text-sm md:text-base text-navy">
                  {style.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish */}
      <div className="space-y-4">
        <p className="label-eyebrow text-gold">Choose your finish</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "silver" as JewelryFinish, name: "Silver", price: silverPrice },
            { id: "gold" as JewelryFinish, name: "Gold", price: goldPrice },
          ].map((finish) => {
            const selected = order.jewelry_finish === finish.id;
            return (
              <button
                key={finish.id}
                type="button"
                onClick={() =>
                  setOrder((prev) => ({ ...prev, jewelry_finish: finish.id }))
                }
                className={cn(
                  "relative rounded-xl border p-4 transition-all bg-card hover:border-gold text-left",
                  selected
                    ? "border-gold ring-2 ring-gold/40"
                    : "border-border/60",
                )}
              >
                {selected && (
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center size-5 rounded-full bg-gold text-navy">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
                <p className="font-serif text-base text-navy">{finish.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${finish.price}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info notice */}
      <div className="rounded-xl bg-cream border border-border/60 p-4 flex gap-3">
        <Info className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your QR code is engraved on the front. Every time they scan it, your song
          plays. Art is not available on jewelry — the QR code is the gift.
        </p>
      </div>

      {/* Engraving */}
      <div className="space-y-5">
        <p className="label-eyebrow text-gold">
          Engraving — what would you like engraved on the back?
        </p>

        <div className="space-y-2">
          <label htmlFor="engrave-1" className="text-xs text-navy font-medium block">
            Line 1 — Name or short phrase (required)
          </label>
          <Input
            id="engrave-1"
            maxLength={20}
            required
            value={order.engraving_line_1}
            onChange={(e) =>
              setOrder((prev) => ({ ...prev, engraving_line_1: e.target.value }))
            }
            className="h-11 rounded-xl bg-cream border-border/60"
          />
          <p className="text-xs text-muted-foreground text-right">
            {order.engraving_line_1.length}/20
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="engrave-2" className="text-xs text-navy font-medium block">
            Line 2 — Date or second line (optional)
          </label>
          <Input
            id="engrave-2"
            maxLength={20}
            value={order.engraving_line_2}
            onChange={(e) =>
              setOrder((prev) => ({ ...prev, engraving_line_2: e.target.value }))
            }
            className="h-11 rounded-xl bg-cream border-border/60"
          />
          <p className="text-xs text-muted-foreground text-right">
            {order.engraving_line_2.length}/20
          </p>
        </div>

        <p className="text-xs text-muted-foreground italic">
          Engraving is included — no extra charge.
        </p>
      </div>
    </div>
  );
};

export default Start;
