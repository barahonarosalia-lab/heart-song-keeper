import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, AlertTriangle, XCircle, Info, Play, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { priceIdForOrder, DIGITAL_ADDON_PRICE_ID, VINYL_PHOTO_UPSELL_PRICE_ID, amountForPriceKey, BASE_STORY_PRICES, TIER_UPCHARGE } from "@/lib/pricing";
import PhotoPreview from "@/components/PhotoPreview";
import luminaries from "@/assets/collection-luminaries.jpg";
import meadow from "@/assets/collection-meadow.jpg";
import fable from "@/assets/collection-fable.jpg";
import botanica from "@/assets/collection-botanica.jpg";
import ember from "@/assets/collection-ember.jpg";

// ----- Types --------------------------------------------------------------

type Tier = "story" | "voice" | "memory";
type SongVersion = "instrumental" | "humming" | "with_lyrics";
type ProductId = "digital" | "canvas" | "ornament" | "jewelry" | "blanket";
type PhotoQuality = "green" | "yellow" | "red";
type JewelryStyle = "heart" | "round" | "dogtag";
type JewelryFinish = "silver" | "gold";
type PhotoOrArt = "photo" | "art";
type VoicePreference = "male" | "female" | "surprise";

interface OrderState {
  tier: Tier | null;
  occasion: string | null;
  song_version: SongVersion | null;
  whose_audio: string;
  // Shared across tiers: for Voice/Memory this holds the instrumental style;
  // for Story it holds the genre value.
  music_style_preference: string | null;
  voice_preference: VoicePreference | null;
  // Story-tier intake fields (UI comes later)
  story_who: string;
  story_memory: string;
  story_feeling: string;
  use_name_in_lyrics: boolean;
  audio_url: string;
  video_url: string;
  send_link_later: boolean;
  audio_consent: boolean;
  audio_consent_at: string | null;
  product: ProductId | null;
  // Applies to canvas / blanket / digital only. UI comes later.
  photo_or_art: PhotoOrArt | null;
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
  art_id: string | null;
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
  blanket_orientation: "portrait" | "landscape";
  photo_natural_orientation: "portrait" | "landscape" | "square" | null;
  photo_reviewed: boolean;
  photo_crop_area: { x: number; y: number; width: number; height: number } | null;
  photo_zoom: number;
  // Vinyl Poster upsell — Story tier only, on Canvas or Digital products.
  // A style flag on the base SKU (not a separate product). When the user
  // opts into the photo center, a $10 line item (VINYL_PHOTO_UPSELL_PRICE_ID)
  // is added to the checkout session. The photo itself reuses the shared
  // photo_url / photo_crop_area / photo_zoom fields (only one photo per order).
  is_vinyl_poster: boolean;
  vinyl_header_text: string;
  vinyl_bottom_text: string;
  vinyl_photo_upsell: boolean;
}

// Capitalized tier value sent in the checkout payload — backend does an
// exact-match lookup on this string, so keep the capitalization exact.
const tierPayloadLabel = (tier: Tier): "Story" | "Voice" | "Memory" =>
  tier === "story" ? "Story" : tier === "voice" ? "Voice" : "Memory";

// "Surprise Me" stays as literal "surprise" in UI state so the chip stays
// highlighted; resolve to a concrete male/female only at payload build time.
const resolveVoicePreference = (
  v: VoicePreference | null,
): "male" | "female" | null => {
  if (v === "surprise") return Math.random() < 0.5 ? "male" : "female";
  return v;
};

const STORY_RELATIONSHIPS = [
  "Husband", "Wife", "Partner", "Girlfriend", "Boyfriend",
  "Son", "Daughter", "Fiancé", "Father", "Mother",
  "Grandparent", "Grandson", "Granddaughter", "Sibling",
  "Friend", "Myself", "Other",
];

const STORY_GENRES = [
  "Pop", "Country", "Rock", "R&B", "Jazz", "Acoustic",
  "Rap/Hip-Hop", "Indie", "Latin", "Worship", "Reggaeton", "Reggae",
];

const STORY_VOICES: { value: VoicePreference; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "surprise", label: "Surprise Me" },
];

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
  "Lullaby & Nursery",
  "Pregnancy Announcement",
  "Birthday",
  "Mother's Day",
  "Father's Day",
  "Military & Deployment",
  "Graduation",
  "College Send-Off",
  "Sobriety & Recovery",
  "Get Well",
  "Retirement",
  "Thank You",
  "Missing You",
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
  story: number;
  voice: number;
  memory: number;
  tagline: string;
  details: string[];
  cta: string;
}

const PRODUCTS: ProductDef[] = [
  {
    id: "digital",
    name: "Digital Download",
    story: 49,
    voice: 69,
    memory: 79,
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
    story: 99,
    voice: 119,
    memory: 129,
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
    story: 79,
    voice: 99,
    memory: 109,
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
    name: "Jewelry — Heart · Round · Dog Tag",
    story: 109,
    voice: 129,
    memory: 139,
    tagline: "Worn every day. Scanned whenever they need it.",
    details: [
      "Heart · Round · Dog Tag",
      "Silver or Gold",
      "Ships in 5-7 business days",
      "Free shipping",
    ],
    cta: "Choose Jewelry",
  },
  {
    id: "blanket",
    name: "Blanket",
    story: 139,
    voice: 159,
    memory: 169,
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
  { id: "round", name: "Round" },
  { id: "dogtag", name: "Dog Tag" },
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
  "Lullaby & Nursery": "little_luminaries",
  "Pregnancy Announcement": "little_luminaries",
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
const STEP4_PRODUCTS: ProductId[] = ["canvas", "blanket", "digital"];

// ----- Card designs (Step 5) ---------------------------------------------

interface CardDesign {
  id: string;
  collection: string;
  name: string;
  cover: string;
  accentColor: string;
  comingSoon?: boolean;
}

const CARD_ART_BASE = "https://assets.keyofhearts.com/koh-card-art";

const CARD_DESIGNS: CardDesign[] = [
  {
    id: "card_little_luminaries",
    collection: "Little Luminaries",
    name: "Blush moon, pink clouds, soft stars",
    cover: `${CARD_ART_BASE}/little-luminaries.jpg`,
    accentColor: "#D4A5C9",
  },
  {
    id: "card_meadow_mane",
    collection: "Meadow & Mane",
    name: "Warm botanical frame, gold geometric border",
    cover: `${CARD_ART_BASE}/meadow-mane.jpg`,
    accentColor: "#7A9E7E",
  },
  {
    id: "card_meadow_mane_dark",
    collection: "Meadow & Mane",
    name: "Moodier palette — deep forest, dusk botanicals",
    cover: `${CARD_ART_BASE}/meadow-mane-dark.jpg`,
    accentColor: "#8B9E6E",
  },
  {
    id: "card_moonlit_botanica",
    collection: "Moonlit Botanica",
    name: "Deep navy, white rose, gold botanical line art",
    cover: `${CARD_ART_BASE}/moonlit-botanica.jpg`,
    accentColor: "#7B9E9E",
  },
  {
    id: "card_fable_fawn",
    collection: "Fable & Fawn",
    name: "Moonlit fox, glowing cottage, botanical charm",
    cover: `${CARD_ART_BASE}/fable-fawn.jpg`,
    accentColor: "#A0785A",
  },
  {
    id: "card_ember_ivy",
    collection: "Ember & Ivy",
    name: "Candlelit garden, paired foxes, cottage roses",
    cover: `${CARD_ART_BASE}/ember-ivy.jpg`,
    accentColor: "#C9A84C",
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
    case "ornament":
      return "Included with their ornament. Frameable. Yours to keep forever.";
    case "digital":
      return "Your PDF card arrives instantly by email — ready to print or frame.";
  }
};

// Step 5 QR notice copy based on tier + Preserve audio choice
const qrNoticeCopy = (order: OrderState): string => {
  if (order.tier === "story") {
    return "Your card includes a unique QR code linked to their song. Physical cards are printed and on their way within 2 business days. Digital orders receive their card by email instantly.";
  }
  if ((order.tier === "voice" || order.tier === "memory") && order.send_link_later) {
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
    music_style_preference: null,
    audio_url: "",
    video_url: "",
    send_link_later: false,
    audio_consent: false,
    audio_consent_at: null,
    voice_preference: null,
    story_who: "",
    story_memory: "",
    story_feeling: "",
    use_name_in_lyrics: false,
    product: null,
    photo_or_art: null,
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
    art_id: null,
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
    blanket_orientation: "portrait",
    photo_natural_orientation: null,
    photo_reviewed: false,
    photo_crop_area: null,
    photo_zoom: 1,
    is_vinyl_poster: false,
    vinyl_header_text: "",
    vinyl_bottom_text: "",
    vinyl_photo_upsell: false,
  });

  const { openCheckout, checkoutElement } = useStripeCheckout();
  const [addDigitalCopy, setAddDigitalCopy] = useState(false);

  const digitalAddonEligible =
    order.product === "canvas" || order.product === "blanket";

  const handleCheckout = () => {
    if (!order.product || !order.tier) return;
    const priceId = priceIdForOrder({
      product: order.product,
      tier: order.tier,
      jewelryFinish: order.jewelry_finish,
    });
    if (!priceId) return;
    const wantsAddon = digitalAddonEligible && addDigitalCopy;

    // Build the full metadata payload for Process Order. Stripe metadata
    // values must be strings, so stringify objects/arrays and String()
    // primitives. Only include fields that have a real value for this
    // order — skip nulls / empty strings so we don't send jewelry fields
    // on a canvas order, etc.
    const metadata: Record<string, string> = {
      flow: "start",
      product: order.product,
      tier: tierPayloadLabel(order.tier),
    };
    const put = (key: string, value: unknown) => {
      if (value === null || value === undefined) return;
      if (typeof value === "string") {
        if (value.length === 0) return;
        metadata[key] = value;
      } else if (typeof value === "boolean" || typeof value === "number") {
        metadata[key] = String(value);
      } else {
        metadata[key] = JSON.stringify(value);
      }
    };

    const o = order as OrderState & Record<string, unknown>;
    put("recipient_name", order.recipient_name);
    put("gifter_name", order.gifter_name);
    put("occasion", order.occasion);
    put("voice_preference", resolveVoicePreference(order.voice_preference));
    put("collection", order.collection);
    put("art_id", order.art_id);
    put("card_design", order.card_design);
    put("blanket_orientation",
      order.product === "blanket" ? order.blanket_orientation : null);
    put("dedication", order.dedication);
    put("customer_message", order.customer_message);
    put("use_exact_words", order.use_exact_words);
    put("card_message", o.card_message);
    put("story_who", order.story_who);
    put("story_memory", order.story_memory);
    put("story_feeling", order.story_feeling);
    put("use_name_in_lyrics", order.use_name_in_lyrics);
    put("music_style_preference", order.music_style_preference);
    put("photo_url", order.photo_url);
    put("photo_quality", order.photo_quality);
    put("photo_quality_override", order.photo_quality_override);
    put("photo_crop_area", order.photo_crop_area);
    put("photo_zoom",
      order.photo_url && order.photo_zoom !== 1 ? order.photo_zoom : null);
    put("audio_url", order.audio_url);
    put("video_url", order.video_url);
    put("audio_consent", order.audio_consent ? true : null);
    put("audio_consent_at", order.audio_consent_at);
    put("send_link_later", order.send_link_later ? true : null);
    put("jewelry_style", order.jewelry_style);
    put("jewelry_finish", order.jewelry_finish);
    put("engraving_line_1",
      order.product === "jewelry" ? order.engraving_line_1 : null);
    put("engraving_line_2",
      order.product === "jewelry" ? order.engraving_line_2 : null);
    put("ornament_design", order.ornament_design);
    put("ornament_dedication",
      order.product === "ornament" ? order.ornament_dedication : null);
    put("ornament_year",
      order.product === "ornament" ? order.ornament_year : null);
    put("ornament_line_1",
      order.product === "ornament" ? order.ornament_line_1 : null);
    put("ornament_line_2",
      order.product === "ornament" ? order.ornament_line_2 : null);
    put("shipping_name", o.shipping_name);
    put("shipping_address", o.shipping_address);
    put("shipping_city", o.shipping_city);
    put("shipping_state", o.shipping_state);
    put("shipping_zip", o.shipping_zip);
    put("shipping_country", o.shipping_country);

    if (wantsAddon) {
      metadata.addon = "digital_addon";
      metadata.addon_price_id = DIGITAL_ADDON_PRICE_ID;
    }

    // Vinyl Poster (Story tier, Canvas/Digital only). is_vinyl_poster is a
    // style flag on the base SKU; when vinyl_photo_upsell is also true we
    // bundle the $10 photo-center line item alongside the base price.
    const extraPriceIds: string[] = [];
    if (order.is_vinyl_poster) {
      put("is_vinyl_poster", true);
      put("vinyl_header_text", order.vinyl_header_text);
      put("vinyl_bottom_text", order.vinyl_bottom_text);
      if (order.vinyl_photo_upsell) {
        put("vinyl_photo_upsell", true);
        extraPriceIds.push(VINYL_PHOTO_UPSELL_PRICE_ID);
      }
    }

    openCheckout({
      priceId,
      metadata,
      returnUrl: `${window.location.origin}/order/{CHECKOUT_SESSION_ID}`,
      ...(extraPriceIds.length > 0 && { extraPriceIds }),
    });
  };

  const handleSelectTier = (tier: Tier) => {
    setOrder((prev) => ({ ...prev, tier }));
  };

  const handleSelectProduct = (product: ProductId) => {
    setOrder((prev) => ({
      ...prev,
      product,
      ornament_design: product === "ornament" ? prev.ornament_design : null,
      ornament_dedication: product === "ornament" ? prev.ornament_dedication : "",
      ornament_year: product === "ornament" ? prev.ornament_year : "",
      ornament_line_1: product === "ornament" ? prev.ornament_line_1 : "",
      ornament_line_2: product === "ornament" ? prev.ornament_line_2 : "",
      jewelry_style: product === "jewelry" ? prev.jewelry_style : null,
      jewelry_finish: product === "jewelry" ? prev.jewelry_finish : null,
      engraving_line_1: product === "jewelry" ? prev.engraving_line_1 : "",
      engraving_line_2: product === "jewelry" ? prev.engraving_line_2 : "",
      photo_url: "",
      photo_quality: null,
      photo_quality_override: false,
      blanket_orientation: "portrait",
      photo_natural_orientation: null,
      photo_reviewed: false,
      photo_crop_area: null,
      photo_zoom: 1,
    }));
  };

  // Pre-select product from ?product= query
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const productParam = searchParams.get("product");
    if (!productParam) return;
    const valid: ProductId[] = ["digital", "canvas", "ornament", "jewelry", "blanket"];
    if (valid.includes(productParam as ProductId)) {
      setOrder((prev) => ({ ...prev, product: productParam as ProductId }));
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-fill collection + art from /collections deep link
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
      art_id: piece ? piece.id : prev.art_id,
    }));
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist photo blanket orientation across navigations
  const ORIENTATION_KEY = "koh_blanket_orientation";
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ORIENTATION_KEY);
      if (stored === "portrait" || stored === "landscape") {
        setOrder((prev) => ({ ...prev, blanket_orientation: stored }));
      }
    } catch {
      /* sessionStorage unavailable */
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(ORIENTATION_KEY, order.blanket_orientation);
    } catch {
      /* ignore */
    }
  }, [order.blanket_orientation]);

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

      {/* STEP 1 — Tier picker */}
      <Step
        index="01"
        title="How would you like to gift them?"
        subtitle="This choice shapes everything — your song, your product, your price."
      >
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-6xl">
          <TierCard
            label="STORY"
            heading="We compose their song"
            subtext="We've created original songs for every occasion. Preview three and pick the one that feels like them."
            examples="· Instrumental · Humming · With Lyrics"
            price={`From $${BASE_STORY_PRICES.digital + TIER_UPCHARGE.story}`}
            cta="Choose Story"
            selected={order.tier === "story"}
            onSelect={() => handleSelectTier("story")}
          />
          <TierCard
            label="VOICE"
            heading="We preserve their voice"
            subtext="Upload any recording — a voicemail, vows, a bedtime story. We wrap it in an original score composed just for them."
            examples="· Voicemail · Vows · Bedtime stories · Deployment recordings"
            price={`From $${BASE_STORY_PRICES.digital + TIER_UPCHARGE.voice}`}
            cta="Choose Voice"
            selected={order.tier === "voice"}
            onSelect={() => handleSelectTier("voice")}
          />
          <TierCard
            label="MEMORY"
            heading="We preserve their moment"
            subtext="Upload a video — a birthday, a homecoming, a moment you never want to lose. We wrap it in an original score composed just for them."
            examples="· Birthdays · Homecomings · First steps · Reunions"
            price={`From $${BASE_STORY_PRICES.digital + TIER_UPCHARGE.memory}`}
            cta="Choose Memory"
            selected={order.tier === "memory"}
            onSelect={() => handleSelectTier("memory")}
          />
        </div>
      </Step>

      {/* Tier-specific wizard */}
      {order.tier === "story" && (
        <StoryWizard
          order={order}
          setOrder={setOrder}
          addDigitalCopy={addDigitalCopy}
          setAddDigitalCopy={setAddDigitalCopy}
          digitalAddonEligible={digitalAddonEligible}
          onSelectProduct={handleSelectProduct}
          onCheckout={handleCheckout}
        />
      )}
      {(order.tier === "voice" || order.tier === "memory") && (
        <VoiceMemoryWizard
          order={order}
          setOrder={setOrder}
          addDigitalCopy={addDigitalCopy}
          setAddDigitalCopy={setAddDigitalCopy}
          digitalAddonEligible={digitalAddonEligible}
          onSelectProduct={handleSelectProduct}
          onCheckout={handleCheckout}
        />
      )}

      {checkoutElement}
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
  hideExpansion = false,
}: {
  product: ProductDef;
  tier: Tier;
  selected: boolean;
  onSelect: () => void;
  onChooseArt: () => void;
  order: OrderState;
  setOrder: React.Dispatch<React.SetStateAction<OrderState>>;
  hideExpansion?: boolean;
}) => {
  // Base price by tier; jewelry gold finish adds $10.
  const basePrice = product[tier];
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
            product.id === "digital" && idx === 0 && (tier === "voice" || tier === "memory");
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

      {(!selected || hideExpansion) && (
        <button
          type="button"
          onClick={onSelect}
          className="mt-auto inline-flex items-center justify-center rounded-full h-11 px-5 text-sm font-medium bg-navy text-cream hover:bg-navy-deep transition-colors"
        >
          {selected ? "Selected" : product.cta}
        </button>
      )}

      {!hideExpansion && selected && product.id === "ornament" && (
        <OrnamentExpansion order={order} setOrder={setOrder} />
      )}

      {!hideExpansion && selected && product.id === "jewelry" && (
        <JewelryExpansion order={order} setOrder={setOrder} tier={tier} />
      )}

      {!hideExpansion &&
        selected &&
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
  const silverPrice = amountForPriceKey("jewelry_silver", tier);
  const goldPrice = amountForPriceKey("jewelry_gold", tier);

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
              <div className="p-3 border-t-2" style={{ borderTopColor: design.accentColor }}>
                <p className="label-eyebrow mb-1 flex items-center gap-1.5" style={{ color: design.accentColor }}>
                  <span
                    className="inline-block size-1.5 rounded-full"
                    style={{ backgroundColor: design.accentColor }}
                    aria-hidden
                  />
                  {design.collection}
                </p>
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
  orientation,
  naturalOrientation,
  reviewed,
  onUpload,
  onRemove,
  onOverride,
  onOrientationChange,
  onReviewedChange,
}: {
  photoUrl: string;
  quality: PhotoQuality | null;
  override: boolean;
  orientation: "portrait" | "landscape";
  naturalOrientation: "portrait" | "landscape" | "square" | null;
  reviewed: boolean;
  onUpload: (file: File | null) => void;
  onRemove: () => void;
  onOverride: () => void;
  onOrientationChange: (o: "portrait" | "landscape") => void;
  onReviewedChange: (checked: boolean) => void;
}) => {
  const qualityOk = !!photoUrl && (quality !== "red" || override);
  const previewAspect =
    orientation === "portrait" ? "aspect-[4/5]" : "aspect-[5/4]";
  const previewMaxWidth =
    orientation === "portrait" ? "max-w-[280px]" : "max-w-md";
  // Cropping happens whenever the user's chosen orientation doesn't match the
  // photo's natural orientation. A landscape photo forced into portrait (or
  // vice-versa) will be cropped to fit.
  const willBeCropped =
    !!photoUrl &&
    naturalOrientation !== null &&
    naturalOrientation !== "square" &&
    naturalOrientation !== orientation;

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
        <div className="space-y-6">
          <div
            className={cn(
              "relative rounded-2xl overflow-hidden border border-border/60 bg-card transition-all",
              previewAspect,
              previewMaxWidth,
            )}
          >
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

          {/* Orientation selector — appears once a photo is uploaded and quality is acceptable */}
          {qualityOk && (
            <div className="space-y-3 pt-2 border-t border-border/40">
              <p className="label-eyebrow text-gold pt-4">
                How would you like your photo oriented?
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <OrientationOption
                  label="Portrait (vertical)"
                  sublabel="Taller than wide"
                  selected={orientation === "portrait"}
                  onSelect={() => onOrientationChange("portrait")}
                  variant="portrait"
                />
                <OrientationOption
                  label="Landscape (horizontal)"
                  sublabel="Wider than tall"
                  selected={orientation === "landscape"}
                  onSelect={() => onOrientationChange("landscape")}
                  variant="landscape"
                />
              </div>

              {/* Crop warning — fires when the chosen orientation forces a crop.
                  Most commonly: a landscape photo placed into a portrait blanket. */}
              {(orientation === "landscape" || willBeCropped) && (
                <div
                  className="flex items-start gap-2.5 text-sm font-medium leading-relaxed pt-3"
                  style={{ color: "#C4796A" }}
                >
                  <AlertTriangle className="size-5 shrink-0 mt-0.5" />
                  <span>
                    Your photo will be cropped to fit. We'll show you a preview
                    before your order is confirmed.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Reviewed confirmation checkbox */}
          {qualityOk && (
            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(e) => onReviewedChange(e.target.checked)}
                className="mt-1 size-4 rounded border-border text-gold focus:ring-gold cursor-pointer accent-[hsl(var(--gold))]"
              />
              <span className="text-sm text-navy leading-relaxed">
                I've reviewed my photo and confirm it's the one I want printed
                on my blanket.
              </span>
            </label>
          )}
        </div>
      )}
    </div>
  );
};

const OrientationOption = ({
  label,
  sublabel,
  selected,
  onSelect,
  variant,
}: {
  label: string;
  sublabel: string;
  selected: boolean;
  onSelect: () => void;
  variant: "portrait" | "landscape";
}) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={selected}
    className={cn(
      "flex flex-col items-center gap-2 rounded-xl border-2 bg-card px-4 py-4 transition-all text-center",
      selected
        ? "border-gold bg-gold/5 shadow-soft"
        : "border-border/60 hover:border-gold/60",
    )}
  >
    <span
      className={cn(
        "block rounded-md border-2 transition-colors",
        selected ? "border-gold bg-gold/10" : "border-navy/40 bg-navy/5",
        variant === "portrait" ? "w-6 h-9" : "w-9 h-6",
      )}
      aria-hidden
    />
    <span className="text-sm font-medium text-navy">{label}</span>
    <span className="text-[11px] text-muted-foreground leading-tight">
      {sublabel}
    </span>
  </button>
);


// ----- Wizard shell (reusable; only Story wired for now) ------------------

interface WizardStep {
  title: string;
  subtitle?: string;
  isValid: () => boolean;
  render: () => React.ReactNode;
}

const WizardShell = ({
  steps,
  onFinish,
  finishLabel = "Continue",
}: {
  steps: WizardStep[];
  onFinish: () => void;
  finishLabel?: string;
}) => {
  const [idx, setIdx] = useState(0);
  const total = steps.length;
  const step = steps[idx];
  const canNext = step.isValid();
  const isLast = idx === total - 1;
  const containerRef = useRef<HTMLElement | null>(null);
  const stepRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);

  // On mount (tier just chosen), scroll wizard container into view.
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // On step change (Next/Back), scroll to the step heading.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [idx]);

  return (
    <section ref={containerRef} className="container py-16 md:py-24 scroll-mt-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <p className="label-eyebrow text-gold">
            Step {idx + 1} of {total}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={idx === 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            className="text-navy/70 hover:text-gold"
          >
            <ArrowLeft className="size-4 mr-1" /> Back
          </Button>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-navy/10 rounded-full mb-10 overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${((idx + 1) / total) * 100}%` }}
          />
        </div>

        <div
          ref={stepRef}
          key={idx}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 scroll-mt-4"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-navy text-balance leading-[1.1] mb-3">
            {step.title}
          </h2>
          {step.subtitle && (
            <p className="text-muted-foreground text-lg mb-8 text-balance">
              {step.subtitle}
            </p>
          )}
          <div className="mt-8">{step.render()}</div>
        </div>

        <div className="flex justify-end mt-12">
          <Button
            type="button"
            size="lg"
            disabled={!canNext}
            onClick={() => {
              if (isLast) onFinish();
              else setIdx((i) => Math.min(total - 1, i + 1));
            }}
            className="bg-gold text-navy hover:bg-gold/90 disabled:opacity-40"
          >
            {isLast ? finishLabel : "Next"}
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// ----- Chip grid ----------------------------------------------------------

const ChipGrid = ({
  options,
  value,
  onSelect,
}: {
  options: { value: string; label: string }[] | string[];
  value: string | null;
  onSelect: (v: string) => void;
}) => {
  const normalized = (options as (string | { value: string; label: string })[]).map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  return (
    <div className="flex flex-wrap gap-2.5">
      {normalized.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onSelect(o.value)}
            className={cn(
              "rounded-full px-4 h-10 text-sm font-medium border transition-all",
              selected
                ? "bg-gold text-navy border-gold shadow-gold"
                : "bg-card text-navy border-border/60 hover:border-gold",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

// ----- Shared wizard step builders ---------------------------------------

type SetOrder = React.Dispatch<React.SetStateAction<OrderState>>;

const UPLOADCARE_PUBLIC_KEY = "b449aa35a5d74a79b1d5";

const buildRelationshipStep = (order: OrderState, setOrder: SetOrder): WizardStep => ({
  title: "Who is this song for?",
  subtitle: "Pick the relationship that fits best.",
  isValid: () => !!order.relationship,
  render: () => (
    <ChipGrid
      options={STORY_RELATIONSHIPS}
      value={order.relationship || null}
      onSelect={(v) => setOrder((prev) => ({ ...prev, relationship: v }))}
    />
  ),
});

const buildNameStep = (order: OrderState, setOrder: SetOrder): WizardStep => ({
  title: "What's their name?",
  subtitle: "We'll use this throughout the experience.",
  isValid: () => !!order.recipient_name.trim(),
  render: () => (
    <Input
      value={order.recipient_name}
      onChange={(e) =>
        setOrder((prev) => ({ ...prev, recipient_name: e.target.value }))
      }
      placeholder="e.g. Sarah"
      className="h-14 rounded-xl bg-card border-border/60 text-lg"
      autoFocus
    />
  ),
});

// Sub-component with local state for the "Something else" input
const OccasionStepBody = ({
  order,
  setOrder,
}: {
  order: OrderState;
  setOrder: SetOrder;
}) => {
  const [customOccasion, setCustomOccasion] = useState(
    order.occasion && !OCCASIONS.includes(order.occasion) ? order.occasion : "",
  );
  const [occasionMode, setOccasionMode] = useState<"preset" | "custom">(
    order.occasion && !OCCASIONS.includes(order.occasion) ? "custom" : "preset",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2.5">
        {OCCASIONS.map((occ) => {
          const selected = occasionMode === "preset" && order.occasion === occ;
          return (
            <button
              key={occ}
              type="button"
              onClick={() => {
                setOccasionMode("preset");
                setOrder((prev) => ({ ...prev, occasion: occ }));
              }}
              className={cn(
                "rounded-full px-4 h-10 text-sm font-medium border transition-all",
                selected
                  ? "bg-gold text-navy border-gold shadow-gold"
                  : "bg-card text-navy border-border/60 hover:border-gold",
              )}
            >
              {occ}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setOccasionMode("custom");
            setOrder((prev) => ({ ...prev, occasion: customOccasion }));
          }}
          className={cn(
            "rounded-full px-4 h-10 text-sm font-medium border transition-all",
            occasionMode === "custom"
              ? "bg-gold text-navy border-gold shadow-gold"
              : "bg-card text-navy border-border/60 hover:border-gold",
          )}
        >
          Something else
        </button>
      </div>
      {occasionMode === "custom" && (
        <Input
          value={customOccasion}
          onChange={(e) => {
            setCustomOccasion(e.target.value);
            setOrder((prev) => ({ ...prev, occasion: e.target.value }));
          }}
          placeholder="Tell us the occasion"
          className="h-12 rounded-xl bg-card border-border/60"
          autoFocus
        />
      )}
    </div>
  );
};

const buildOccasionStep = (order: OrderState, setOrder: SetOrder): WizardStep => ({
  title: "What's the occasion?",
  subtitle: "Every moment has its own song.",
  isValid: () => !!(order.occasion && order.occasion.trim()),
  render: () => <OccasionStepBody order={order} setOrder={setOrder} />,
});

const buildProductStep = (
  order: OrderState,
  setOrder: SetOrder,
  onSelectProduct: (product: ProductId) => void,
): WizardStep => ({
  title: "What would you like to gift them?",
  subtitle:
    "Free shipping on every US order. 🌍 International customers pay shipping — shown before payment.",
  isValid: () => !!order.product,
  render: () => (
    <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
      {PRODUCTS.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          tier={order.tier!}
          selected={order.product === product.id}
          onSelect={() => onSelectProduct(product.id)}
          onChooseArt={() => {}}
          order={order}
          setOrder={setOrder}
          hideExpansion
        />
      ))}
    </div>
  ),
});

// Sub-component that hosts the product-specific configuration UI
const ProductSubStepBody = ({
  order,
  setOrder,
}: {
  order: OrderState;
  setOrder: SetOrder;
}) => {
  const activeCollection = useMemo(
    () => COLLECTIONS.find((c) => c.id === order.collection) ?? null,
    [order.collection],
  );

  // Default collection from occasion when entering an art-picker product
  useEffect(() => {
    if (
      order.product &&
      ART_PRODUCTS.includes(order.product) &&
      order.occasion &&
      !order.collection
    ) {
      const defaultId = OCCASION_TO_COLLECTION[order.occasion];
      if (defaultId) {
        setOrder((prev) => ({ ...prev, collection: defaultId }));
      }
    }
  }, [order.product, order.occasion, order.collection, setOrder]);

  if (!order.product) return null;
  if (order.product === "jewelry") {
    return <JewelryExpansion order={order} setOrder={setOrder} tier={order.tier!} />;
  }
  if (order.product === "ornament") {
    return <OrnamentExpansion order={order} setOrder={setOrder} />;
  }
  const mode: "photo" | "art" = order.photo_or_art === "photo" ? "photo" : "art";
  const setMode = (m: "photo" | "art") =>
    setOrder((prev) => ({ ...prev, photo_or_art: m }));

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="inline-flex rounded-full border border-border/60 bg-card p-1">
        {(
          [
            { id: "art", label: "Choose from our art collection" },
            { id: "photo", label: "Upload a photo" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMode(opt.id)}
            className={cn(
              "px-4 md:px-5 py-2 rounded-full text-sm font-medium transition-colors",
              mode === opt.id ? "bg-navy text-cream" : "text-navy/70 hover:text-navy",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {mode === "photo" ? (
        <PhotoPreview
          product={order.product as "canvas" | "blanket" | "digital"}
          value={order.photo_url}
          onChange={(dataUrl) =>
            setOrder((prev) => ({
              ...prev,
              photo_url: dataUrl,
              art_id: dataUrl ? null : prev.art_id,
            }))
          }
          blanketOrientation={order.blanket_orientation}
          quality={order.photo_quality}
          onQualityChange={(q) =>
            setOrder((prev) => ({ ...prev, photo_quality: q }))
          }
          acknowledged={order.photo_quality_override}
          onAcknowledgedChange={(v) =>
            setOrder((prev) => ({ ...prev, photo_quality_override: v }))
          }
          onCropAreaChange={(area, zoom) =>
            setOrder((prev) => ({
              ...prev,
              photo_crop_area: area
                ? { x: area.x, y: area.y, width: area.width, height: area.height }
                : null,
              photo_zoom: zoom,
            }))
          }
        />
      ) : (
        <>
          <div className="space-y-3 max-w-md">
            <label htmlFor="wiz-collection-select" className="label-eyebrow text-gold block">
              Collection
            </label>
            <select
              id="wiz-collection-select"
              value={order.collection ?? ""}
              onChange={(e) =>
                setOrder((prev) => ({
                  ...prev,
                  collection: e.target.value || null,
                  art_id: null,
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
            {order.occasion &&
              OCCASION_TO_COLLECTION[order.occasion] === order.collection && (
                <p className="text-xs text-muted-foreground italic">
                  Suggested for "{order.occasion}" — change anytime.
                </p>
              )}
          </div>

          {activeCollection && (
            <ArtGallery
              collection={activeCollection}
              selectedId={order.art_id}
              onToggle={(pieceId) =>
                setOrder((prev) => ({
                  ...prev,
                  art_id: prev.art_id === pieceId ? null : pieceId,
                }))
              }
            />
          )}
        </>
      )}
    </div>
  );
};

const buildProductSubStep = (order: OrderState, setOrder: SetOrder): WizardStep => {
  const productSubValid = (() => {
    if (!order.product) return false;
    if (order.product === "jewelry") {
      return (
        !!order.jewelry_style &&
        !!order.jewelry_finish &&
        !!order.engraving_line_1.trim()
      );
    }
    if (order.product === "ornament") return !!order.ornament_design;
    if (ART_PRODUCTS.includes(order.product)) {
      const mode = order.photo_or_art === "photo" ? "photo" : "art";
      if (mode === "photo") {
        if (!order.photo_url) return false;
        if (order.photo_quality === "green") return true;
        return order.photo_quality_override;
      }
      return !!order.art_id;
    }
    return false;
  })();

  const productSubTitle =
    order.product === "jewelry"
      ? "Design their jewelry."
      : order.product === "ornament"
      ? "Design their ornament."
      : order.product
      ? `Choose the art for their ${PRODUCT_TO_ART_NOUN[order.product] ?? "gift"}.`
      : "";

  return {
    title: productSubTitle,
    subtitle:
      order.product && ART_PRODUCTS.includes(order.product)
        ? "This is what they'll see every time they hold it."
        : undefined,
    isValid: () => productSubValid,
    render: () => <ProductSubStepBody order={order} setOrder={setOrder} />,
  };
};

// ----- Vinyl Poster step (Story tier, Canvas or Digital only) ------------

const VinylPosterStepBody = ({
  order,
  setOrder,
}: {
  order: OrderState;
  setOrder: SetOrder;
}) => {
  const productLabel =
    order.product === "canvas" ? "Canvas" : "Digital";
  const photoOk =
    !!order.vinyl_photo_url &&
    (order.vinyl_photo_quality === "green" ||
      order.vinyl_photo_quality_override);

  return (
    <div className="space-y-8">
      {/* Yes / No */}
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() =>
            setOrder((prev) => ({ ...prev, is_vinyl_poster: true }))
          }
          className={cn(
            "relative rounded-2xl border p-6 text-left transition-all bg-card",
            order.is_vinyl_poster
              ? "border-gold ring-2 ring-gold/40 shadow-card"
              : "border-border/60 hover:border-gold",
          )}
        >
          {order.is_vinyl_poster && (
            <span className="absolute top-3 right-3 inline-flex items-center justify-center size-7 rounded-full bg-gold text-navy">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
          )}
          <p className="label-eyebrow text-gold mb-2">Vinyl Poster</p>
          <p className="font-serif text-xl text-navy leading-tight pr-8">
            Yes, make it a Vinyl Poster
          </p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Their song's actual lyrics wrap around the edge like a record label,
            with your own header text at the top.
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            setOrder((prev) => ({
              ...prev,
              is_vinyl_poster: false,
              vinyl_photo_upsell: false,
              vinyl_header_text: "",
              vinyl_bottom_text: "",
              vinyl_photo_url: "",
              vinyl_photo_quality: null,
              vinyl_photo_quality_override: false,
              vinyl_photo_crop_area: null,
              vinyl_photo_zoom: 1,
            }))
          }
          className={cn(
            "relative rounded-2xl border p-6 text-left transition-all bg-card",
            order.is_vinyl_poster === false
              ? "border-gold ring-2 ring-gold/40 shadow-card"
              : "border-border/60 hover:border-gold",
          )}
        >
          {order.is_vinyl_poster === false && (
            <span className="absolute top-3 right-3 inline-flex items-center justify-center size-7 rounded-full bg-gold text-navy">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
          )}
          <p className="label-eyebrow text-gold mb-2">Standard</p>
          <p className="font-serif text-xl text-navy leading-tight pr-8">
            No, standard {productLabel}
          </p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Keep your {productLabel.toLowerCase()} as-is. You'll choose the art
            or upload a photo in the next step.
          </p>
        </button>
      </div>

      {order.is_vinyl_poster && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pt-2">
          {/* Header text */}
          <div className="space-y-2">
            <label htmlFor="vinyl-header" className="label-eyebrow text-gold block">
              Header text (required)
            </label>
            <Input
              id="vinyl-header"
              value={order.vinyl_header_text}
              onChange={(e) =>
                setOrder((prev) => ({
                  ...prev,
                  vinyl_header_text: e.target.value.slice(0, 60),
                }))
              }
              placeholder="Happy Anniversary, Maria"
              className="h-12 rounded-xl bg-card border-border/60"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground text-right">
              {order.vinyl_header_text.length}/60
            </p>
          </div>

          {/* Date (optional) */}
          <div className="space-y-2">
            <label htmlFor="vinyl-date" className="label-eyebrow text-gold block">
              Date (optional)
            </label>
            <Input
              id="vinyl-date"
              value={order.vinyl_bottom_text}
              onChange={(e) =>
                setOrder((prev) => ({
                  ...prev,
                  vinyl_bottom_text: e.target.value.slice(0, 40),
                }))
              }
              placeholder="June 14, 2026"
              className="h-12 rounded-xl bg-card border-border/60"
              maxLength={40}
            />
          </div>

          {/* Center choice */}
          <div className="space-y-3">
            <p className="label-eyebrow text-gold">Choose the center</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setOrder((prev) => ({
                    ...prev,
                    vinyl_photo_upsell: false,
                    vinyl_photo_url: "",
                    vinyl_photo_quality: null,
                    vinyl_photo_quality_override: false,
                    vinyl_photo_crop_area: null,
                    vinyl_photo_zoom: 1,
                  }))
                }
                className={cn(
                  "relative rounded-2xl border p-5 text-left transition-all bg-card",
                  !order.vinyl_photo_upsell
                    ? "border-gold ring-2 ring-gold/40 shadow-card"
                    : "border-border/60 hover:border-gold",
                )}
              >
                {!order.vinyl_photo_upsell && (
                  <span className="absolute top-3 right-3 inline-flex items-center justify-center size-6 rounded-full bg-gold text-navy">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
                <p className="label-eyebrow text-gold mb-1">Included</p>
                <p className="font-serif text-lg text-navy pr-8">QR Code</p>
                <p className="text-sm text-muted-foreground mt-1">
                  A QR code and short tagline sit at the center — scan to hear
                  their song.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setOrder((prev) => ({ ...prev, vinyl_photo_upsell: true }))
                }
                className={cn(
                  "relative rounded-2xl border p-5 text-left transition-all bg-card",
                  order.vinyl_photo_upsell
                    ? "border-gold ring-2 ring-gold/40 shadow-card"
                    : "border-border/60 hover:border-gold",
                )}
              >
                {order.vinyl_photo_upsell && (
                  <span className="absolute top-3 right-3 inline-flex items-center justify-center size-6 rounded-full bg-gold text-navy">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
                <p className="label-eyebrow text-gold mb-1">+ $10</p>
                <p className="font-serif text-lg text-navy pr-8">Your Photo</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Swap the center for a photo of your recipient — round, like a
                  vinyl label.
                </p>
              </button>
            </div>
          </div>

          {/* Photo upload with circular crop */}
          {order.vinyl_photo_upsell && (
            <div className="space-y-3 pt-2 border-t border-border/40 animate-in fade-in duration-300">
              <p className="label-eyebrow text-gold pt-4">
                Upload your center photo
              </p>
              <PhotoPreview
                product="vinyl"
                value={order.vinyl_photo_url}
                onChange={(dataUrl) =>
                  setOrder((prev) => ({ ...prev, vinyl_photo_url: dataUrl }))
                }
                quality={order.vinyl_photo_quality}
                onQualityChange={(q) =>
                  setOrder((prev) => ({ ...prev, vinyl_photo_quality: q }))
                }
                acknowledged={order.vinyl_photo_quality_override}
                onAcknowledgedChange={(v) =>
                  setOrder((prev) => ({
                    ...prev,
                    vinyl_photo_quality_override: v,
                  }))
                }
                onCropAreaChange={(area, zoom) =>
                  setOrder((prev) => ({
                    ...prev,
                    vinyl_photo_crop_area: area
                      ? { x: area.x, y: area.y, width: area.width, height: area.height }
                      : null,
                    vinyl_photo_zoom: zoom,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                This is a preview of your photo placement only — the finished
                poster will also include your song's actual lyrics wrapped
                around the edge, generated after you choose your song.
              </p>
              {photoOk && (
                <p className="text-xs text-emerald-700">
                  Photo ready — you can continue.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const buildVinylPosterStep = (
  order: OrderState,
  setOrder: SetOrder,
): WizardStep => ({
  title: "Want this as a Vinyl Poster?",
  subtitle:
    "A circular poster with your recipient's actual song lyrics wrapping the edge like a vinyl record label, with your own header text at the top.",
  isValid: () => {
    // Must make an explicit yes/no choice
    if (order.is_vinyl_poster === null || order.is_vinyl_poster === undefined) {
      // Boolean is always defined; treat unset as invalid via header check below.
    }
    if (!order.is_vinyl_poster) return true; // "No" is valid — skip vinyl fields
    if (!order.vinyl_header_text.trim()) return false;
    if (order.vinyl_photo_upsell) {
      if (!order.vinyl_photo_url) return false;
      if (order.vinyl_photo_quality === "green") return true;
      return order.vinyl_photo_quality_override;
    }
    return true;
  },
  render: () => <VinylPosterStepBody order={order} setOrder={setOrder} />,
});



const buildCardArtStep = (order: OrderState, setOrder: SetOrder): WizardStep => ({
  title: "Choose the art for their card.",
  subtitle: order.product ? cardSubheadlineForProduct(order.product) : undefined,
  isValid: () => !!order.card_design,
  render: () => (
    <div className="space-y-8 md:space-y-10">
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
      <div className="rounded-2xl bg-cream border border-border/60 p-5 md:p-6 space-y-3">
        <p className="label-eyebrow text-gold">Your QR code</p>
        <p className="text-sm md:text-base text-navy/80 leading-relaxed">
          {qrNoticeCopy(order)}
        </p>
      </div>
    </div>
  ),
});

const buildReviewStep = (
  order: OrderState,
  setOrder: SetOrder,
  addDigitalCopy: boolean,
  setAddDigitalCopy: React.Dispatch<React.SetStateAction<boolean>>,
  digitalAddonEligible: boolean,
): WizardStep => ({
  title: "Make it theirs.",
  subtitle: "One last look, then off to checkout.",
  isValid: () =>
    !!order.gifter_name.trim() &&
    !!order.recipient_name.trim() &&
    !!order.relationship.trim() &&
    !!order.product &&
    !!order.tier,
  render: () => (
    <div className="space-y-10 md:space-y-12">
      <div className="space-y-3">
        <label htmlFor="wiz-gifter-name" className="label-eyebrow text-gold block">
          Your name
        </label>
        <Input
          id="wiz-gifter-name"
          value={order.gifter_name}
          onChange={(e) =>
            setOrder((prev) => ({ ...prev, gifter_name: e.target.value }))
          }
          placeholder="Your first name"
          className="h-12 rounded-xl bg-card border-border/60 text-base"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="wiz-customer-message" className="label-eyebrow text-gold block">
          Your message{" "}
          <span className="text-muted-foreground/70 normal-case tracking-normal">
            (optional)
          </span>
        </label>
        <Textarea
          id="wiz-customer-message"
          value={order.customer_message}
          maxLength={500}
          rows={5}
          onChange={(e) =>
            setOrder((prev) => ({
              ...prev,
              customer_message: e.target.value.slice(0, 500),
            }))
          }
          placeholder="Write something from the heart — a memory, a moment, what they mean to you."
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

      <div className="space-y-3">
        <label htmlFor="wiz-dedication" className="label-eyebrow text-gold block">
          A short dedication{" "}
          <span className="text-muted-foreground/70 normal-case tracking-normal">
            (optional)
          </span>
        </label>
        <Input
          id="wiz-dedication"
          value={order.dedication}
          maxLength={100}
          onChange={(e) =>
            setOrder((prev) => ({
              ...prev,
              dedication: e.target.value.slice(0, 100),
            }))
          }
          placeholder="e.g. Because they were here."
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

      {digitalAddonEligible && (
        <label
          htmlFor="wiz-digital-addon"
          className={cn(
            "flex items-start gap-3 rounded-2xl border p-5 cursor-pointer transition-all",
            addDigitalCopy
              ? "border-gold bg-gold/5 shadow-soft"
              : "border-border/60 bg-card hover:border-gold/60",
          )}
        >
          <Checkbox
            id="wiz-digital-addon"
            checked={addDigitalCopy}
            onCheckedChange={(c) => setAddDigitalCopy(c === true)}
            className="mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <p className="font-serif text-navy text-base md:text-lg">
              Add a digital copy — $10
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              A high-resolution PNG + PDF of their art, delivered to your inbox.
            </p>
          </div>
        </label>
      )}
    </div>
  ),
});

// ----- Voice/Memory content step (upload + consent + music) --------------

const VoiceMemoryContentStepBody = ({
  order,
  setOrder,
}: {
  order: OrderState;
  setOrder: SetOrder;
}) => {
  const isVoice = order.tier === "voice";
  const widgetRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(
    !!order.music_style_preference &&
      order.music_style_preference !== "No Music" &&
      order.music_style_preference !== "No Background Music",
  );

  // When music toggle is off, force "No Music" as the stored value
  useEffect(() => {
    if (!musicOn && order.music_style_preference !== "No Music") {
      setOrder((prev) => ({ ...prev, music_style_preference: "No Music" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicOn]);

  // Load Uploadcare widget script and wire onUploadComplete
  useEffect(() => {
    const SRC = "https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js";
    const init = () => {
      const uc = (window as unknown as { uploadcare?: any }).uploadcare;
      if (!uc || !widgetRef.current) return;
      const widget = uc.Widget(widgetRef.current);
      widget.onUploadComplete((info: { cdnUrl: string }) => {
        setUploadError(null);
        setOrder((prev) =>
          isVoice
            ? { ...prev, audio_url: info.cdnUrl }
            : { ...prev, video_url: info.cdnUrl },
        );
      });
    };
    if ((window as unknown as { uploadcare?: any }).uploadcare) {
      init();
      return;
    }
    const existing = document.querySelector(
      `script[src="${SRC}"]`,
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }
    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    script.onload = init;
    script.onerror = () =>
      setUploadError("We couldn't load the uploader. Please refresh and try again.");
    document.body.appendChild(script);
  }, [isVoice, setOrder]);

  const uploadedUrl = isVoice ? order.audio_url : order.video_url;

  return (
    <div className="space-y-8">
      {!order.send_link_later && (
        <div className="space-y-3">
          <p className="label-eyebrow text-gold">
            Upload their {isVoice ? "audio" : "video"}
          </p>
          <div className="rounded-xl border border-dashed border-gold/40 bg-cream/50 p-6">
            <input
              ref={widgetRef}
              type="hidden"
              data-public-key={UPLOADCARE_PUBLIC_KEY}
              data-tabs="file camera url"
              data-preview-step="true"
              data-images-only="false"
              data-clearable="true"
            />
          </div>
          {uploadedUrl && (
            <p className="text-sm text-navy">
              Uploaded <span className="text-gold">✓</span>
            </p>
          )}
          {uploadError && <p className="text-sm text-rose">{uploadError}</p>}
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={order.send_link_later}
          onCheckedChange={(v) =>
            setOrder((prev) => ({ ...prev, send_link_later: v === true }))
          }
          className="mt-0.5 border-navy/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-navy"
        />
        <span className="text-sm text-navy leading-relaxed">
          I'll send this after I order — email me a link.
        </span>
      </label>

      <div className="rounded-2xl bg-card border border-border/60 p-5 md:p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={order.audio_consent}
            onCheckedChange={(v) =>
              setOrder((prev) => ({
                ...prev,
                audio_consent: v === true,
                audio_consent_at: v === true ? new Date().toISOString() : null,
              }))
            }
            className="mt-0.5 border-navy/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-navy"
          />
          <span className="text-sm text-navy leading-relaxed">
            I have the right to share this recording and consent to it being used to
            create this keepsake.
          </span>
        </label>
      </div>

      <div className="space-y-4 pt-2 border-t border-border/60">
        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <span className="text-base text-navy font-medium">
            Add background music?
          </span>
          <Switch
            checked={musicOn}
            onCheckedChange={setMusicOn}
            className="data-[state=checked]:bg-gold"
          />
        </label>
        {musicOn && (
          <ChipGrid
            options={MUSIC_STYLES.filter((s) => s !== "No Background Music")}
            value={order.music_style_preference}
            onSelect={(v) =>
              setOrder((prev) => ({ ...prev, music_style_preference: v }))
            }
          />
        )}
      </div>
    </div>
  );
};

const buildVoiceMemoryContentStep = (
  order: OrderState,
  setOrder: SetOrder,
): WizardStep => {
  const isVoice = order.tier === "voice";
  return {
    title: isVoice ? "Share their voice." : "Share their moment.",
    isValid: () => {
      const hasFile = isVoice ? !!order.audio_url : !!order.video_url;
      return (hasFile || order.send_link_later) && order.audio_consent;
    },
    render: () => <VoiceMemoryContentStepBody order={order} setOrder={setOrder} />,
  };
};

// ----- Story wizard -------------------------------------------------------

const StoryWizard = ({
  order,
  setOrder,
  addDigitalCopy,
  setAddDigitalCopy,
  digitalAddonEligible,
  onSelectProduct,
  onCheckout,
}: {
  order: OrderState;
  setOrder: SetOrder;
  addDigitalCopy: boolean;
  setAddDigitalCopy: React.Dispatch<React.SetStateAction<boolean>>;
  digitalAddonEligible: boolean;
  onSelectProduct: (product: ProductId) => void;
  onCheckout: () => void;
}) => {
  const steps: WizardStep[] = [
    buildRelationshipStep(order, setOrder),
    buildNameStep(order, setOrder),
    buildOccasionStep(order, setOrder),
    {
      title: "Choose the sound and voice.",
      subtitle: "Pick a genre and who should sing it.",
      isValid: () => !!order.music_style_preference && !!order.voice_preference,
      render: () => (
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="label-eyebrow text-gold">Genre</p>
            <ChipGrid
              options={STORY_GENRES}
              value={order.music_style_preference}
              onSelect={(v) =>
                setOrder((prev) => ({ ...prev, music_style_preference: v }))
              }
            />
          </div>
          <div className="space-y-3">
            <p className="label-eyebrow text-gold">Voice</p>
            <ChipGrid
              options={STORY_VOICES}
              value={order.voice_preference}
              onSelect={(v) =>
                setOrder((prev) => ({
                  ...prev,
                  voice_preference: v as VoicePreference,
                }))
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: "Tell us about them.",
      subtitle: "The more you share, the more personal their song.",
      isValid: () =>
        !!order.story_who.trim() &&
        !!order.story_memory.trim() &&
        !!order.story_feeling.trim(),
      render: () => (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="label-eyebrow text-gold block">
              What makes them special?
            </label>
            <Textarea
              value={order.story_who}
              onChange={(e) =>
                setOrder((prev) => ({ ...prev, story_who: e.target.value }))
              }
              rows={3}
              className="rounded-xl bg-card border-border/60"
              placeholder="Their spirit, their quirks, what you love most…"
            />
          </div>
          <div className="space-y-2">
            <label className="label-eyebrow text-gold block">
              Share a favorite memory
            </label>
            <Textarea
              value={order.story_memory}
              onChange={(e) =>
                setOrder((prev) => ({ ...prev, story_memory: e.target.value }))
              }
              rows={3}
              className="rounded-xl bg-card border-border/60"
              placeholder="A moment that captures who they are…"
            />
          </div>
          <div className="space-y-2">
            <label className="label-eyebrow text-gold block">
              A message from your heart
            </label>
            <Textarea
              value={order.story_feeling}
              onChange={(e) =>
                setOrder((prev) => ({ ...prev, story_feeling: e.target.value }))
              }
              rows={3}
              className="rounded-xl bg-card border-border/60"
              placeholder="What you'd want them to hear, always…"
            />
          </div>
          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <Checkbox
              checked={order.use_name_in_lyrics}
              onCheckedChange={(v) =>
                setOrder((prev) => ({ ...prev, use_name_in_lyrics: v === true }))
              }
              className="mt-0.5 border-navy/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-navy"
            />
            <span className="text-sm text-navy leading-relaxed">
              Use their name in the lyrics
            </span>
          </label>
        </div>
      ),
    },
    buildProductStep(order, setOrder, onSelectProduct),
    // Vinyl Poster upsell — Story tier only, and only when the customer
    // has selected Canvas or Digital. Sits right after product selection
    // so a "No" answer flows straight into the existing productSubStep.
    ...((order.product === "canvas" || order.product === "digital")
      ? [buildVinylPosterStep(order, setOrder)]
      : []),
    buildProductSubStep(order, setOrder),
    buildCardArtStep(order, setOrder),
    buildReviewStep(order, setOrder, addDigitalCopy, setAddDigitalCopy, digitalAddonEligible),
  ];

  return (
    <WizardShell
      steps={steps}
      onFinish={onCheckout}
      finishLabel="Continue to checkout →"
    />
  );
};

// ----- Voice / Memory wizard ---------------------------------------------

const VoiceMemoryWizard = ({
  order,
  setOrder,
  addDigitalCopy,
  setAddDigitalCopy,
  digitalAddonEligible,
  onSelectProduct,
  onCheckout,
}: {
  order: OrderState;
  setOrder: SetOrder;
  addDigitalCopy: boolean;
  setAddDigitalCopy: React.Dispatch<React.SetStateAction<boolean>>;
  digitalAddonEligible: boolean;
  onSelectProduct: (product: ProductId) => void;
  onCheckout: () => void;
}) => {
  const steps: WizardStep[] = [
    buildRelationshipStep(order, setOrder),
    buildNameStep(order, setOrder),
    buildOccasionStep(order, setOrder),
    buildVoiceMemoryContentStep(order, setOrder),
    buildProductStep(order, setOrder, onSelectProduct),
    buildProductSubStep(order, setOrder),
    buildCardArtStep(order, setOrder),
    buildReviewStep(order, setOrder, addDigitalCopy, setAddDigitalCopy, digitalAddonEligible),
  ];

  return (
    <WizardShell
      steps={steps}
      onFinish={onCheckout}
      finishLabel="Continue to checkout →"
    />
  );
};


export default Start;
