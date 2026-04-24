import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, AlertTriangle, XCircle, Info, Play, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import luminaries from "@/assets/collection-luminaries.jpg";
import meadow from "@/assets/collection-meadow.jpg";
import fable from "@/assets/collection-fable.jpg";
import botanica from "@/assets/collection-botanica.jpg";
import ember from "@/assets/collection-ember.jpg";

// ----- Types --------------------------------------------------------------

type Tier = "signature" | "preserve";
type SongVersion = "instrumental" | "humming" | "with_lyrics";
type ProductId = "digital" | "canvas" | "ornament" | "jewelry" | "blanket" | "photo_blanket" | "gift_card";
type PhotoQuality = "green" | "yellow" | "red";
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
  card_design: string | null;
  gifter_name: string;
  recipient_name: string;
  relationship: string;
  customer_message: string;
  dedication: string;
  use_exact_words: boolean;
  photo_url: string;
  photo_quality: PhotoQuality | null;
  photo_quality_override: boolean;
  gift_card_amount: number | null;
  gift_card_custom_amount: number | null;
  gift_card_recipient_name: string;
  gift_card_gifter_name: string;
  gift_card_note: string;
}

const SONG_VERSIONS: { value: SongVersion; label: string; title: string }[] = [
  { value: "instrumental", label: "INSTRUMENTAL", title: "Song 1" },
  { value: "humming", label: "HUMMING", title: "Song 2" },
  { value: "with_lyrics", label: "WITH LYRICS", title: "Song 3" },
];

const OCCASIONS = [
  "Memorial & Grief",
  "Pregnancy Loss",
  "Pet Memorial",
  "Anniversary & Wedding",
  "Baby & Birth",
  "New Parent",
  "Birthday",
  "Mother's Day",
  "Father's Day",
  "Military & Deployment",
  "Graduation",
  "College Send-Off",
  "Sobriety & Recovery",
  "Friendship",
  "Just Because",
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
  {
    id: "photo_blanket",
    name: "Photo Blanket",
    signature: 119,
    preserve: 139,
    tagline: "A moment in time. Their voice. Forever.",
    details: [
      "Your photo full bleed",
      "QR code woven into art",
      "Sherpa 50x60",
      "Ships in 3-5 business days",
      "Free shipping",
    ],
    cta: "Choose Photo Blanket",
  },
  {
    id: "gift_card",
    name: "Gift Card",
    signature: 29,
    preserve: 29,
    tagline: "The perfect gift when you're not sure what they'd love.",
    details: [
      "Choose any amount from $29",
      "Delivered instantly by email",
      "Beautiful PDF — print or forward",
      "Redeemable at keyofhearts.com/redeem",
      "Never expires",
      "Free",
    ],
    cta: "Choose Gift Card",
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

// Generate 10 placeholder art slots per collection.
// Real art images will be swapped in before launch.
const makePlaceholders = (collectionId: string, count = 10): ArtPiece[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${collectionId}_art_${i + 1}`,
    name: `Art ${i + 1}`,
  }));

const COLLECTIONS: CollectionDef[] = [
  {
    id: "little_luminaries",
    name: "Little Luminaries",
    cover: luminaries,
    pieces: makePlaceholders("little_luminaries"),
  },
  {
    id: "moonlit_botanica",
    name: "Moonlit Botanica",
    cover: botanica,
    pieces: makePlaceholders("moonlit_botanica"),
  },
  {
    id: "meadow_mane",
    name: "Meadow & Mane",
    cover: meadow,
    pieces: makePlaceholders("meadow_mane"),
  },
  {
    id: "fable_fawn",
    name: "Fable & Fawn",
    cover: fable,
    pieces: makePlaceholders("fable_fawn"),
  },
  {
    id: "ember_ivy",
    name: "Ember & Ivy",
    cover: ember,
    pieces: makePlaceholders("ember_ivy"),
  },
];

// Map an occasion (Step 2) to a default collection (Step 4)
const OCCASION_TO_COLLECTION: Record<string, string> = {
  "Memorial & Grief": "moonlit_botanica",
  "Pregnancy Loss": "moonlit_botanica",
  "Pet Memorial": "moonlit_botanica",
  "Anniversary & Wedding": "ember_ivy",
  "Baby & Birth": "little_luminaries",
  "New Parent": "little_luminaries",
  "Birthday": "meadow_mane",
  "Mother's Day": "little_luminaries",
  "Father's Day": "meadow_mane",
  "Military & Deployment": "meadow_mane",
  "Graduation": "meadow_mane",
  "College Send-Off": "meadow_mane",
  "Sobriety & Recovery": "meadow_mane",
  "Friendship": "fable_fawn",
  "Just Because": "meadow_mane",
};

// Map a product to the Step 4 headline noun
const PRODUCT_TO_ART_NOUN: Partial<Record<ProductId, string>> = {
  canvas: "canvas",
  blanket: "blanket",
  digital: "digital download",
};

// Products that route through the art-picker step
const ART_PRODUCTS: ProductId[] = ["canvas", "blanket", "digital"];

// Products that auto-scroll to Step 4 (art picker OR photo upload)
const STEP4_PRODUCTS: ProductId[] = ["canvas", "blanket", "digital", "photo_blanket"];

// ----- Card designs (Step 5) ---------------------------------------------

interface CardDesign {
  id: string;
  collection: string;
  name: string;
  cover: string;
  comingSoon?: boolean;
}

const CARD_DESIGNS: CardDesign[] = [
  {
    id: "card_little_luminaries",
    collection: "Little Luminaries",
    name: "Blush moon, pink clouds, soft stars",
    cover: luminaries,
  },
  {
    id: "card_meadow_mane",
    collection: "Meadow & Mane",
    name: "Warm botanical frame, gold geometric border",
    cover: meadow,
  },
  {
    id: "card_moonlit_botanica",
    collection: "Moonlit Botanica",
    name: "Deep navy, white rose, gold botanical line art",
    cover: botanica,
  },
  {
    id: "card_fable_fawn",
    collection: "Fable & Fawn",
    name: "Coming soon",
    cover: fable,
    comingSoon: true,
  },
  {
    id: "card_ember_ivy",
    collection: "Ember & Ivy",
    name: "Coming soon",
    cover: ember,
    comingSoon: true,
  },
];

// Step 5 dynamic subheadline based on product
const cardSubheadlineForProduct = (product: ProductId): string => {
  switch (product) {
    case "jewelry":
      return "Your card ships first — arriving before their jewelry so they know something beautiful is on its way.";
    case "canvas":
      return "Included with their canvas. Frameable. Yours to keep forever.";
    case "blanket":
      return "Included with their blanket. Frameable. Yours to keep forever.";
    case "photo_blanket":
      return "Included with their photo blanket. Frameable. Yours to keep forever.";
    case "ornament":
      return "Included with their ornament. Frameable. Yours to keep forever.";
    case "digital":
      return "Your PDF card arrives instantly by email — ready to print or frame.";
  }
};

// Step 5 QR notice copy based on tier + Preserve audio choice
const qrNoticeCopy = (order: OrderState): string => {
  if (order.tier === "signature") {
    return "Your card includes a unique QR code linked to their song. Physical cards are printed and on their way within 2 business days. Digital orders receive their card by email instantly.";
  }
  if (order.tier === "preserve" && order.send_link_later) {
    return "Your card includes a unique QR code. From the moment it arrives, scanning it plays a beautiful song matched to their occasion. Send us their audio when you're ready — we'll have their voice live within 48 hours of receiving it. The card never waits. Neither does the music.";
  }
  // Preserve + audio uploaded
  return "Your card includes a unique QR code. While your recording is being prepared, scanning it will play a beautiful song matched to their occasion. Once your audio is ready — within 48 hours of us receiving it — the QR updates to their voice. They'll never hold a silent key.";
};

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
    card_design: null,
    gifter_name: "",
    recipient_name: "",
    relationship: "",
    customer_message: "",
    dedication: "",
    use_exact_words: false,
    photo_url: "",
    photo_quality: null,
    photo_quality_override: false,
    gift_card_amount: null,
    gift_card_custom_amount: null,
    gift_card_recipient_name: "",
    gift_card_gifter_name: "",
    gift_card_note: "",
  });

  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);
  const step6Ref = useRef<HTMLDivElement>(null);
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
      photo_url: product === "photo_blanket" ? prev.photo_url : "",
      photo_quality: product === "photo_blanket" ? prev.photo_quality : null,
      photo_quality_override:
        product === "photo_blanket" ? prev.photo_quality_override : false,
    }));

    // Auto-scroll to Step 4 when a product that uses it is selected
    if (STEP4_PRODUCTS.includes(product)) {
      setTimeout(() => {
        step4Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  };

  // Handle photo upload for photo blanket — checks dimensions client-side
  const handlePhotoUpload = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const shortest = Math.min(img.naturalWidth, img.naturalHeight);
      let quality: PhotoQuality = "red";
      if (shortest >= 3000) quality = "green";
      else if (shortest >= 1500) quality = "yellow";
      setOrder((prev) => ({
        ...prev,
        photo_url: url,
        photo_quality: quality,
        photo_quality_override: false,
      }));
    };
    img.onerror = () => {
      setOrder((prev) => ({
        ...prev,
        photo_url: url,
        photo_quality: "red",
        photo_quality_override: false,
      }));
    };
    img.src = url;
  };

  const handleRemovePhoto = () => {
    setOrder((prev) => ({
      ...prev,
      photo_url: "",
      photo_quality: null,
      photo_quality_override: false,
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

  // Handler: jump from Step 3 product card to Step 4 (art picker)
  const handleChooseArt = () => {
    setTimeout(() => {
      step4Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  // Pre-fill collection + art from /collections deep link (?collection=...&art=N)
  const [searchParams] = useSearchParams();
  const [fromCollections, setFromCollections] = useState(false);
  const [prefilledArtId, setPrefilledArtId] = useState<string | null>(null);
  useEffect(() => {
    const slug = searchParams.get("collection");
    const artParam = searchParams.get("art");
    if (!slug) return;
    const collectionId = slug.replace(/-/g, "_");
    const collectionDef = COLLECTIONS.find((c) => c.id === collectionId);
    if (!collectionDef) return;
    const artNum = artParam ? parseInt(artParam, 10) : NaN;
    const piece =
      Number.isFinite(artNum) && artNum >= 1 && artNum <= collectionDef.pieces.length
        ? collectionDef.pieces[artNum - 1]
        : null;
    setOrder((prev) => ({
      ...prev,
      collection: collectionId,
      art_selected: piece ? piece.id : prev.art_selected,
    }));
    setFromCollections(true);
    if (piece) setPrefilledArtId(piece.id);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default the collection from the chosen occasion when entering Step 4 —
  // only when no collection is set yet, so the customer can still change it.
  // Skipped when the customer arrived from /collections with a chosen collection.
  useEffect(() => {
    if (
      order.product &&
      ART_PRODUCTS.includes(order.product) &&
      order.occasion &&
      !order.collection &&
      !fromCollections
    ) {
      const defaultId = OCCASION_TO_COLLECTION[order.occasion];
      if (defaultId) {
        setOrder((prev) => ({ ...prev, collection: defaultId }));
      }
    }
  }, [order.product, order.occasion, order.collection, fromCollections]);

  const showStep4 = !!order.product && STEP4_PRODUCTS.includes(order.product);
  const step4Headline =
    order.product === "photo_blanket"
      ? "Upload their photo."
      : order.product
      ? `Choose the art for their ${PRODUCT_TO_ART_NOUN[order.product] ?? "gift"}.`
      : "";
  const step4Subtitle =
    order.product === "photo_blanket"
      ? "This is what will be printed full bleed on their blanket. Choose something that matters."
      : "This is what they'll see every time they hold it.";
  const activeCollection = useMemo(
    () => COLLECTIONS.find((c) => c.id === order.collection) ?? null,
    [order.collection],
  );

  // Step 3 is "complete" once the customer has picked everything required for
  // their product. This unlocks Step 5 (the card art picker).
  const step3Complete = (() => {
    if (!order.product) return false;
    if (ART_PRODUCTS.includes(order.product)) return !!order.art_selected;
    if (order.product === "photo_blanket") {
      return (
        !!order.photo_url &&
        (order.photo_quality !== "red" || order.photo_quality_override)
      );
    }
    if (order.product === "ornament") return !!order.ornament_design;
    if (order.product === "jewelry") {
      return (
        !!order.jewelry_style &&
        !!order.jewelry_finish &&
        !!order.engraving_line_1.trim()
      );
    }
    return false;
  })();

  // Reveal Step 5 once Step 3 is complete
  useEffect(() => {
    if (step3Complete && step5Ref.current) {
      setTimeout(() => {
        step5Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [step3Complete]);

  // Step 5 is complete once the customer has selected a (selectable) card design
  const step5Complete = !!order.card_design;

  // Reveal Step 6 once Step 5 is complete
  useEffect(() => {
    if (step5Complete && step6Ref.current) {
      setTimeout(() => {
        step6Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [step5Complete]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Build a clean recap of the order for Step 6 summary
  const summaryItems: { label: string; value: string; ref: React.RefObject<HTMLDivElement> }[] = [];
  if (order.tier) {
    summaryItems.push({
      label: "Tier",
      value: order.tier === "signature" ? "Signature" : "Preserve",
      ref: step2Ref,
    });
  }
  if (order.occasion) {
    summaryItems.push({ label: "Occasion", value: order.occasion, ref: step2Ref });
  }
  if (order.product) {
    const p = PRODUCTS.find((x) => x.id === order.product);
    if (p) summaryItems.push({ label: "Product", value: p.name, ref: step3Ref });
  }
  if (order.product === "jewelry") {
    if (order.jewelry_style) {
      const s = JEWELRY_STYLES.find((j) => j.id === order.jewelry_style);
      summaryItems.push({
        label: "Jewelry style",
        value: `${s?.name ?? ""}${order.jewelry_finish ? ` · ${order.jewelry_finish === "gold" ? "Gold" : "Silver"}` : ""}`,
        ref: step3Ref,
      });
    }
    const eng = [order.engraving_line_1, order.engraving_line_2].filter(Boolean).join(" / ");
    if (eng) summaryItems.push({ label: "Engraving", value: eng, ref: step3Ref });
  }
  if (order.product === "ornament") {
    if (order.ornament_design) {
      const d = ORNAMENT_DESIGNS.find((x) => x.id === order.ornament_design);
      if (d) summaryItems.push({ label: "Ornament design", value: d.name, ref: step3Ref });
    }
    const ornText = [order.ornament_line_1, order.ornament_line_2, order.ornament_year, order.ornament_dedication]
      .filter(Boolean)
      .join(" · ");
    if (ornText) summaryItems.push({ label: "Ornament text", value: ornText, ref: step3Ref });
  }
  if (order.art_selected && activeCollection) {
    const piece = activeCollection.pieces.find((p) => p.id === order.art_selected);
    summaryItems.push({
      label: "Art selected",
      value: `${activeCollection.name} — ${piece?.name ?? ""}`,
      ref: step4Ref,
    });
  }
  if (order.product === "photo_blanket" && order.photo_url) {
    const qualityLabel =
      order.photo_quality === "green"
        ? "High quality"
        : order.photo_quality === "yellow"
        ? "Good quality"
        : "Quality override";
    summaryItems.push({
      label: "Photo uploaded",
      value: qualityLabel,
      ref: step4Ref,
    });
  }
  if (order.card_design) {
    const cd = CARD_DESIGNS.find((c) => c.id === order.card_design);
    if (cd) summaryItems.push({ label: "Card art", value: cd.collection, ref: step5Ref });
  }

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
                  onChooseArt={handleChooseArt}
                  order={order}
                  setOrder={setOrder}
                />
              ))}
            </div>
          </Step>
        )}
      </div>

      {/* STEP 4 — Art picker (Canvas/Blanket/Digital) OR Photo upload (Photo Blanket) */}
      <div ref={step4Ref}>
        {showStep4 && (
          <Step
            index="04"
            title={step4Headline}
            subtitle={step4Subtitle}
          >
            <div className="max-w-5xl space-y-8 md:space-y-10">
              {order.product === "photo_blanket" ? (
                <PhotoUpload
                  photoUrl={order.photo_url}
                  quality={order.photo_quality}
                  override={order.photo_quality_override}
                  onUpload={handlePhotoUpload}
                  onRemove={handleRemovePhoto}
                  onOverride={() =>
                    setOrder((prev) => ({ ...prev, photo_quality_override: true }))
                  }
                />
              ) : (
                <>
                  {/* Collection dropdown */}
                  <div className="space-y-3 max-w-md">
                    <label htmlFor="collection-select" className="label-eyebrow text-gold block">
                      Collection
                    </label>
                    <select
                      id="collection-select"
                      value={order.collection ?? ""}
                      onChange={(e) =>
                        setOrder((prev) => ({
                          ...prev,
                          collection: e.target.value || null,
                          art_selected: null,
                        }))
                      }
                      className="h-12 w-full rounded-xl bg-card border border-border/60 px-4 text-base text-navy font-serif focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-colors"
                    >
                      <option value="" disabled>
                        Choose a collection
                      </option>
                      {COLLECTIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {fromCollections &&
                      prefilledArtId &&
                      order.art_selected === prefilledArtId && (
                        <p className="text-xs text-gold/80 italic">
                          You chose this art from our collections — change anytime.
                        </p>
                      )}
                    {!(fromCollections && order.art_selected === prefilledArtId) &&
                      order.occasion &&
                      OCCASION_TO_COLLECTION[order.occasion] === order.collection && (
                        <p className="text-xs text-muted-foreground italic">
                          Suggested for "{order.occasion}" — change anytime.
                        </p>
                      )}
                  </div>

                  {/* Image gallery — horizontal swipe */}
                  {activeCollection && (
                    <ArtGallery
                      collection={activeCollection}
                      selectedId={order.art_selected}
                      onToggle={(pieceId) =>
                        setOrder((prev) => ({
                          ...prev,
                          art_selected: prev.art_selected === pieceId ? null : pieceId,
                        }))
                      }
                    />
                  )}
                </>
              )}
            </div>
          </Step>
        )}
      </div>

      {/* STEP 5 — Choose the art for their card */}
      <div ref={step5Ref}>
        {step3Complete && order.product && (
          <Step
            index="05"
            title="Choose the art for their card."
            subtitle={cardSubheadlineForProduct(order.product)}
          >
            <div className="max-w-5xl space-y-8 md:space-y-10">
              <CardGallery
                designs={CARD_DESIGNS}
                selectedId={order.card_design}
                onToggle={(designId) =>
                  setOrder((prev) => ({
                    ...prev,
                    card_design: prev.card_design === designId ? null : designId,
                  }))
                }
              />

              {/* QR info notice */}
              <div className="rounded-2xl bg-cream border border-border/60 p-5 md:p-6 space-y-3">
                <p className="label-eyebrow text-gold">Your QR code</p>
                <p className="text-sm md:text-base text-navy/80 leading-relaxed">
                  {qrNoticeCopy(order)}
                </p>
              </div>
            </div>
          </Step>
        )}
      </div>

      {/* STEP 6 — Make it theirs */}
      <div ref={step6Ref}>
        {step5Complete && (
          <Step
            index="06"
            title="Make it theirs."
            subtitle="This is what makes your Key unlike anything else."
          >
            <div className="max-w-3xl space-y-10 md:space-y-12">
              {/* Your name */}
              <div className="space-y-3">
                <label htmlFor="gifter-name" className="label-eyebrow text-gold block">
                  Your name
                </label>
                <Input
                  id="gifter-name"
                  value={order.gifter_name}
                  onChange={(e) =>
                    setOrder((prev) => ({ ...prev, gifter_name: e.target.value }))
                  }
                  placeholder="Your first name"
                  className="h-12 rounded-xl bg-card border-border/60 text-base"
                />
              </div>

              {/* Their name */}
              <div className="space-y-3">
                <label htmlFor="recipient-name" className="label-eyebrow text-gold block">
                  Their name
                </label>
                <Input
                  id="recipient-name"
                  value={order.recipient_name}
                  onChange={(e) =>
                    setOrder((prev) => ({ ...prev, recipient_name: e.target.value }))
                  }
                  placeholder="Who is this gift for?"
                  className="h-12 rounded-xl bg-card border-border/60 text-base"
                />
              </div>

              {/* Relationship */}
              <div className="space-y-3">
                <label htmlFor="relationship" className="label-eyebrow text-gold block">
                  Your relationship
                </label>
                <Input
                  id="relationship"
                  value={order.relationship}
                  onChange={(e) =>
                    setOrder((prev) => ({ ...prev, relationship: e.target.value }))
                  }
                  placeholder="e.g. my daughter, my best friend, my mom"
                  className="h-12 rounded-xl bg-card border-border/60 text-base"
                />
              </div>

              {/* Your message */}
              <div className="space-y-3">
                <label htmlFor="customer-message" className="label-eyebrow text-gold block">
                  Your message <span className="text-muted-foreground/70 normal-case tracking-normal">(optional)</span>
                </label>
                <Textarea
                  id="customer-message"
                  value={order.customer_message}
                  maxLength={500}
                  rows={5}
                  onChange={(e) =>
                    setOrder((prev) => ({ ...prev, customer_message: e.target.value.slice(0, 500) }))
                  }
                  placeholder="Write something from the heart — a memory, a moment, what they mean to you. We'll shape it into their card message."
                  className="rounded-xl bg-card border-border/60 text-base p-4"
                />
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>
                    Not sure what to say? Leave this blank and we'll write something beautiful from the details you've given us.
                  </p>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {order.customer_message.length}/500
                  </span>
                </div>
              </div>

              {/* Dedication */}
              <div className="space-y-3">
                <label htmlFor="dedication" className="label-eyebrow text-gold block">
                  A short dedication <span className="text-muted-foreground/70 normal-case tracking-normal">(optional)</span>
                </label>
                <Input
                  id="dedication"
                  value={order.dedication}
                  maxLength={100}
                  onChange={(e) =>
                    setOrder((prev) => ({ ...prev, dedication: e.target.value.slice(0, 100) }))
                  }
                  placeholder="e.g. Because they were here. / For every ordinary Tuesday."
                  className="h-12 rounded-xl bg-card border-border/60 text-base"
                />
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>
                    A line that's entirely yours — featured on its own inside their card.
                  </p>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {order.dedication.length}/100
                  </span>
                </div>
              </div>

              {/* Use exact words toggle */}
              <div className="space-y-3">
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="text-base text-navy font-medium">
                    Use my exact words — don't add anything
                  </span>
                  <Switch
                    checked={order.use_exact_words}
                    onCheckedChange={(checked) =>
                      setOrder((prev) => ({ ...prev, use_exact_words: checked }))
                    }
                    className="data-[state=checked]:bg-gold"
                  />
                </label>
                {order.use_exact_words && (
                  <p className="text-sm leading-relaxed italic" style={{ color: "#C4796A" }}>
                    Your words will appear exactly as written. Nothing added. Nothing changed.
                  </p>
                )}
              </div>

              {/* Order summary */}
              <div className="rounded-2xl bg-cream-warm border border-gold/40 p-6 md:p-7 space-y-4 shadow-soft">
                <p className="label-eyebrow text-gold">Your order summary</p>
                <ul className="divide-y divide-gold/15">
                  {summaryItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="py-3 flex items-start justify-between gap-4 text-sm md:text-base"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          {item.label}
                        </p>
                        <p className="text-navy font-serif leading-snug break-words">
                          {item.value}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollToRef(item.ref)}
                        className="text-xs font-medium text-gold hover:text-gold-deep underline underline-offset-4 decoration-gold/40 hover:decoration-gold transition-colors shrink-0 mt-5"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Final CTA */}
              <Button
                type="button"
                variant="gold"
                size="xl"
                className="w-full font-serif text-lg"
                disabled={
                  !order.gifter_name.trim() ||
                  !order.recipient_name.trim() ||
                  !order.relationship.trim()
                }
              >
                Continue to checkout →
              </Button>
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
  onChooseArt,
  order,
  setOrder,
}: {
  product: ProductDef;
  tier: Tier;
  selected: boolean;
  onSelect: () => void;
  onChooseArt: () => void;
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
        {product.details.map((d, idx) => {
          const isFirstDigitalPreserve =
            product.id === "digital" && idx === 0 && tier === "preserve";
          const display = isFirstDigitalPreserve
            ? "Your digital file arrives instantly. Your voice goes live within 48 hours of us receiving it."
            : d;
          return (
            <li key={d} className="flex gap-2">
              <span className="text-gold">·</span>
              <span>{display}</span>
            </li>
          );
        })}
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
          <p className="text-xs text-muted-foreground italic">
            Choose their art below ↓
          </p>
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

// ----- Art gallery (horizontal swipe) -------------------------------------

const ArtGallery = ({
  collection,
  selectedId,
  onToggle,
}: {
  collection: CollectionDef;
  selectedId: string | null;
  onToggle: (pieceId: string) => void;
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset/scroll when the collection changes — if a piece is already selected
  // (e.g. came from /collections deep link), scroll to that piece instead of
  // starting at the first image.
  useEffect(() => {
    const el = scrollerRef.current;
    const selectedIdx = selectedId
      ? collection.pieces.findIndex((p) => p.id === selectedId)
      : -1;
    const targetIdx = selectedIdx >= 0 ? selectedIdx : 0;
    setActiveIndex(targetIdx);
    if (el) {
      const slideWidth = el.clientWidth * 0.85 + 16; // basis ~85% + gap-4
      el.scrollTo({ left: targetIdx * slideWidth, behavior: "auto" });
    }
    // Only react to collection change, not every selection change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection.id]);

  // Track which slide is centered as the user scrolls
  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth * 0.85;
    const idx = Math.round(el.scrollLeft / slideWidth);
    if (idx !== activeIndex && idx >= 0 && idx < collection.pieces.length) {
      setActiveIndex(idx);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <p className="label-eyebrow text-gold">Choose their art</p>

      {/* Swipe row — each slide is ~85% viewport width */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="-mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
        style={{ scrollPaddingLeft: "1.5rem" }}
      >
        {collection.pieces.map((piece) => {
          const selected = selectedId === piece.id;
          return (
            <button
              key={piece.id}
              type="button"
              onClick={() => onToggle(piece.id)}
              className={cn(
                "snap-start shrink-0 w-[85%] sm:w-[70%] md:w-[45%] lg:w-[32%] relative rounded-2xl overflow-hidden bg-card border-2 transition-all duration-300",
                selected
                  ? "border-gold ring-2 ring-gold/40 shadow-card"
                  : "border-border/60 hover:border-gold/60",
              )}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={collection.cover}
                  alt={piece.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              {selected && (
                <span className="absolute top-3 right-3 inline-flex items-center justify-center size-8 rounded-full bg-gold text-navy shadow-gold">
                  <Check className="size-4" strokeWidth={3} />
                </span>
              )}
              <div className="p-3 text-left">
                <p className="font-serif text-sm md:text-base text-navy leading-tight">
                  {piece.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {collection.pieces.map((piece, i) => (
          <span
            key={piece.id}
            className={cn(
              "rounded-full transition-all duration-300",
              i === activeIndex
                ? "size-2 bg-gold"
                : "size-1.5 bg-navy/20",
            )}
          />
        ))}
      </div>
    </div>
  );
};

// ----- Card gallery (Step 5) ---------------------------------------------

const CardGallery = ({
  designs,
  selectedId,
  onToggle,
}: {
  designs: CardDesign[];
  selectedId: string | null;
  onToggle: (designId: string) => void;
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [comingSoonNotice, setComingSoonNotice] = useState<string | null>(null);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth * 0.85;
    const idx = Math.round(el.scrollLeft / slideWidth);
    if (idx !== activeIndex && idx >= 0 && idx < designs.length) {
      setActiveIndex(idx);
    }
  };

  const handleClick = (design: CardDesign) => {
    if (design.comingSoon) {
      setComingSoonNotice(design.collection);
      setTimeout(() => setComingSoonNotice(null), 2400);
      return;
    }
    onToggle(design.id);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <p className="label-eyebrow text-gold">Choose their card</p>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="-mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
        style={{ scrollPaddingLeft: "1.5rem" }}
      >
        {designs.map((design) => {
          const selected = selectedId === design.id;
          const disabled = !!design.comingSoon;
          return (
            <button
              key={design.id}
              type="button"
              onClick={() => handleClick(design)}
              aria-disabled={disabled}
              className={cn(
                "snap-start shrink-0 w-[85%] sm:w-[70%] md:w-[45%] lg:w-[32%] relative rounded-2xl overflow-hidden bg-card border-2 transition-all duration-300 text-left",
                selected
                  ? "border-gold ring-2 ring-gold/40 shadow-card"
                  : "border-border/60 hover:border-gold/60",
                disabled && "opacity-70 cursor-not-allowed hover:border-border/60",
              )}
            >
              <div className="aspect-square overflow-hidden bg-muted relative">
                <img
                  src={design.cover}
                  alt={design.collection}
                  loading="lazy"
                  className={cn(
                    "w-full h-full object-cover",
                    disabled && "grayscale",
                  )}
                />
                {disabled && (
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-navy/80 text-cream text-[10px] tracking-[0.18em] font-medium uppercase px-3 py-1">
                    Coming soon
                  </span>
                )}
              </div>
              {selected && !disabled && (
                <span className="absolute top-3 right-3 inline-flex items-center justify-center size-8 rounded-full bg-gold text-navy shadow-gold">
                  <Check className="size-4" strokeWidth={3} />
                </span>
              )}
              <div className="p-3">
                <p className="label-eyebrow text-gold mb-1">{design.collection}</p>
                <p className="font-serif text-sm md:text-base text-navy leading-tight">
                  {design.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {designs.map((design, i) => (
          <span
            key={design.id}
            className={cn(
              "rounded-full transition-all duration-300",
              i === activeIndex ? "size-2 bg-gold" : "size-1.5 bg-navy/20",
            )}
          />
        ))}
      </div>

      {comingSoonNotice && (
        <p className="text-xs text-muted-foreground text-center italic animate-in fade-in duration-200">
          This collection is coming soon.
        </p>
      )}
    </div>
  );
};

// ----- Photo upload (Photo Blanket) --------------------------------------

const PhotoUpload = ({
  photoUrl,
  quality,
  override,
  onUpload,
  onRemove,
  onOverride,
}: {
  photoUrl: string;
  quality: PhotoQuality | null;
  override: boolean;
  onUpload: (file: File | null) => void;
  onRemove: () => void;
  onOverride: () => void;
}) => {
  return (
    <div className="space-y-5 max-w-2xl">
      {!photoUrl && (
        <label
          htmlFor="photo-file"
          className="block rounded-2xl border-2 border-dashed border-border hover:border-gold hover:bg-gold/5 p-10 md:p-12 text-center cursor-pointer transition-all bg-card/50"
        >
          <input
            id="photo-file"
            type="file"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
          />
          <div className="flex flex-col items-center gap-3">
            <span className="inline-flex items-center justify-center size-14 rounded-full bg-gold/15 text-gold">
              <UploadCloud className="size-7" />
            </span>
            <p className="label-eyebrow text-gold">Upload their photo</p>
            <p className="text-sm text-muted-foreground">
              JPG · PNG · up to 50MB
            </p>
          </div>
        </label>
      )}

      {photoUrl && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-card aspect-[4/3] max-w-md">
            <img
              src={photoUrl}
              alt="Uploaded photo preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="photo-file-replace"
              className="text-xs text-muted-foreground hover:text-gold underline underline-offset-4 cursor-pointer transition-colors"
            >
              Replace photo
              <input
                id="photo-file-replace"
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
              />
            </label>
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-muted-foreground hover:text-rose underline underline-offset-4 transition-colors"
            >
              Remove photo
            </button>
          </div>

          {/* Quality feedback */}
          {quality === "green" && (
            <div
              className="flex items-start gap-2.5 text-sm font-medium leading-relaxed"
              style={{ color: "#2D6A4F" }}
            >
              <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
              <span>Your photo looks great for printing.</span>
            </div>
          )}

          {quality === "yellow" && (
            <div className="flex items-start gap-2.5 text-sm font-medium text-gold leading-relaxed">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <span>
                Your photo will print well. For the sharpest result, a higher
                resolution image gives the best quality on a large blanket.
              </span>
            </div>
          )}

          {quality === "red" && (
            <div className="space-y-2">
              <div
                className="flex items-start gap-2.5 text-sm font-medium leading-relaxed"
                style={{ color: "#C4796A" }}
              >
                <XCircle className="size-5 shrink-0 mt-0.5" />
                <span>
                  This photo may appear blurry when printed at blanket size.
                  Please upload a higher resolution version for the best result.
                  Need help? Email us at{" "}
                  <a
                    href="mailto:hello@keyofhearts.com"
                    className="underline underline-offset-2"
                  >
                    hello@keyofhearts.com
                  </a>
                </span>
              </div>
              {!override && (
                <button
                  type="button"
                  onClick={onOverride}
                  className="text-xs text-muted-foreground hover:text-navy underline underline-offset-4 transition-colors"
                >
                  Continue anyway — I understand the quality may be affected.
                </button>
              )}
              {override && (
                <p className="text-xs italic text-muted-foreground">
                  Quality override accepted — you can continue.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Start;
