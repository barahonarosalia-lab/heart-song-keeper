import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertTriangle, XCircle, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Footer } from "@/components/site/Footer";

// ----- Types -----
type Tier = "signature" | "preserve";
type ProductId = "digital" | "canvas" | "ornament" | "jewelry" | "blanket" | "photo_blanket";
type AudioQuality = "green" | "yellow" | "red";

interface OrderRecord {
  order_id: string;
  date: string;
  tier: Tier;
  occasion: string;
  product: ProductId;
  collection: string;
  art_name: string;
  card_collection: string;
  recipient_name: string;
  gifter_name: string;
  jewelry_style: string;
  audio_uploaded: boolean;
  paid: boolean;
}

const PRODUCT_LABEL: Record<ProductId, string> = {
  digital: "Digital Download",
  canvas: "Canvas Print",
  ornament: "Heirloom Ornament",
  jewelry: "Engraved Jewelry",
  blanket: "KOH Art Blanket",
  photo_blanket: "Photo Blanket",
};

// Mock loader — in production this hits the backend with the order_id.
// For now we read overrides from query params so the page is testable.
const loadOrder = (orderId: string, params: URLSearchParams): OrderRecord | null => {
  if (!orderId || orderId.length < 4) return null;
  return {
    order_id: orderId.toUpperCase(),
    date: params.get("date") ?? new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    }),
    tier: (params.get("tier") as Tier) ?? "signature",
    occasion: params.get("occasion") ?? "Anniversary & Wedding",
    product: (params.get("product") as ProductId) ?? "canvas",
    collection: params.get("collection") ?? "Moonlit Botanica",
    art_name: params.get("art") ?? "Evening Bloom",
    card_collection: params.get("card") ?? "Little Luminaries",
    recipient_name: params.get("recipient") ?? "Sarah",
    gifter_name: params.get("gifter") ?? "James",
    jewelry_style: params.get("jewelry_style") ?? "Engraved Jewelry",
    audio_uploaded: params.get("audio") === "true",
    paid: params.get("paid") !== "false",
  };
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="py-4 border-b border-gold/20 last:border-b-0 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
    <p className="label-eyebrow text-gold">{label}</p>
    <p className="font-serif text-navy text-lg">{value}</p>
  </div>
);

const NextStepsCopy = ({ order }: { order: OrderRecord }) => {
  const { tier, product, recipient_name, audio_uploaded, jewelry_style } = order;

  // ----- Signature -----
  if (tier === "signature" && product === "digital") {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Your card and digital file are being prepared right now. You'll have them in your inbox within 2 business days.
        Your QR code will be live the moment your file arrives.
      </p>
    );
  }
  if (tier === "signature" && product === "canvas") {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Your canvas and card are being prepared together. They'll ship within 3-5 business days and arrive together — ready to hang and scan.
      </p>
    );
  }
  if (tier === "signature" && (product === "blanket" || product === "photo_blanket")) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Your blanket and card are being prepared together. They'll ship within 3-5 business days and arrive together — ready to wrap around and scan.
      </p>
    );
  }
  if (tier === "signature" && product === "ornament") {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Your card ships first — arriving in 2-3 days so {recipient_name} knows something beautiful is on its way.
        Their ornament follows within 5-7 business days.
      </p>
    );
  }
  if (tier === "signature" && product === "jewelry") {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Your card ships first — arriving in 2-3 days so {recipient_name} knows something beautiful is on its way.
        Their {jewelry_style} follows within 5-7 business days.
      </p>
    );
  }

  // ----- Preserve -----
  if (tier === "preserve" && product === "digital" && audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        We received their recording. We're wrapping it in an original score composed just for this moment.
        You'll hear from us within 48 business hours.
        Their QR is already live — playing something beautiful while we work.
      </p>
    );
  }
  if (tier === "preserve" && product === "digital" && !audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Their QR is already live — playing a song matched to their occasion while we wait for their voice.
        Upload their recording below when you're ready. We'll have it live within 48 hours of receiving it.
      </p>
    );
  }
  if (tier === "preserve" && product === "canvas" && audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        We received their recording and we're working on it. Their canvas and card will ship together within 3-5 business days.
        Their QR goes live within 48 hours of their audio being approved.
      </p>
    );
  }
  if (tier === "preserve" && product === "canvas" && !audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Their canvas and card will ship together within 3-5 business days.
        Their QR is already playing something beautiful — upload their recording below when you're ready and we'll have their voice live within 48 hours.
      </p>
    );
  }
  if (tier === "preserve" && (product === "blanket" || product === "photo_blanket") && audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        We received their recording and we're working on it. Their blanket and card will ship together within 3-5 business days.
        Their QR goes live within 48 hours of their audio being approved.
      </p>
    );
  }
  if (tier === "preserve" && (product === "blanket" || product === "photo_blanket") && !audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Their blanket and card will ship together within 3-5 business days.
        Their QR is already playing something beautiful — upload their recording below when you're ready and we'll have their voice live within 48 hours.
      </p>
    );
  }
  if (tier === "preserve" && product === "ornament" && audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        We received their recording and we're working on it. Their card ships first — arriving in 2-3 days.
        Their ornament follows within 5-7 business days.
        Their QR goes live within 48 hours of their audio being approved.
      </p>
    );
  }
  if (tier === "preserve" && product === "ornament" && !audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Their card ships first — arriving in 2-3 days. Their ornament follows within 5-7 business days.
        Their QR is already playing something beautiful — upload their recording below when you're ready.
      </p>
    );
  }
  if (tier === "preserve" && product === "jewelry" && audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        We received their recording and we're working on it. Their card ships first — arriving in 2-3 days.
        Their {jewelry_style} follows within 5-7 business days.
        Their QR goes live within 48 hours of their audio being approved.
      </p>
    );
  }
  if (tier === "preserve" && product === "jewelry" && !audio_uploaded) {
    return (
      <p className="text-navy/80 text-lg leading-relaxed font-light">
        Their card ships first — arriving in 2-3 days. Their {jewelry_style} follows within 5-7 business days.
        Their QR is already playing something beautiful — upload their recording below when you're ready.
      </p>
    );
  }

  // Fallback (should never reach here)
  return (
    <p className="text-navy/80 text-lg leading-relaxed font-light">
      We're preparing your Key with care. You'll hear from us soon.
    </p>
  );
};

const UploadRecording = ({ orderId }: { orderId: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<AudioQuality | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (f: File | null) => {
    if (!f) return;
    setFile(f);
    // Simple quality heuristic on file size (placeholder for true analysis)
    const mb = f.size / (1024 * 1024);
    if (mb >= 5) setQuality("green");
    else if (mb >= 1) setQuality("yellow");
    else setQuality("red");
  };

  const canSubmit = file && consent && quality !== "red";

  if (submitted) {
    return (
      <div className="rounded-2xl border-2 border-gold/40 bg-cream-warm p-8 text-center">
        <CheckCircle2 className="size-10 text-gold mx-auto mb-4" />
        <p className="font-serif text-2xl text-navy mb-2">Their voice is on its way to us.</p>
        <p className="text-navy/70 text-sm">We'll have it live within 48 hours. Order {orderId}.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-gold/40 bg-cream-warm p-6 md:p-10 space-y-6">
      <div>
        <p className="label-eyebrow text-gold mb-2">Their Recording</p>
        <p className="font-serif text-2xl md:text-3xl text-navy">Upload their recording when you're ready.</p>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-gold/50 rounded-xl p-8 text-center hover:bg-gold/5 transition-colors"
      >
        <UploadCloud className="size-8 text-gold mx-auto mb-3" />
        <p className="label-eyebrow text-gold mb-1">
          {file ? "Replace recording" : "Upload their recording"}
        </p>
        <p className="text-xs text-navy/60">MP3 · WAV · M4A · up to 50MB</p>
        {file && <p className="text-sm text-navy mt-3 font-medium">{file.name}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,.mp3,.wav,.m4a"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </button>

      {quality === "green" && (
        <div className="flex items-start gap-2 text-[#2D6A4F]">
          <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
          <p className="text-sm">Their recording sounds beautiful. Ready to send.</p>
        </div>
      )}
      {quality === "yellow" && (
        <div className="flex items-start gap-2 text-gold">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />
          <p className="text-sm">Their recording will work well. A quieter room or closer mic gives the warmest result.</p>
        </div>
      )}
      {quality === "red" && (
        <div className="flex items-start gap-2 text-rose">
          <XCircle className="size-4 mt-0.5 shrink-0" />
          <p className="text-sm">This recording may be too quiet or short. Please try again. Need help? hello@keyofhearts.com</p>
        </div>
      )}

      {file && (
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={consent}
            onCheckedChange={(c) => setConsent(c === true)}
            className="mt-1"
          />
          <span className="text-sm text-navy/80 leading-relaxed">
            I have permission to share this recording and consent to Key of Hearts wrapping it in an original score for this gift.
          </span>
        </label>
      )}

      <Button
        variant="gold"
        size="xl"
        className="w-full font-serif"
        disabled={!canSubmit}
        onClick={() => setSubmitted(true)}
      >
        Send their voice →
      </Button>

      <p className="text-center text-sm text-navy/60 italic">
        Not ready yet? We'll send you reminders — no pressure.
      </p>
    </div>
  );
};

const Order = () => {
  const { orderId = "" } = useParams();
  const [searchParams] = useSearchParams();

  const order = useMemo(() => loadOrder(orderId, searchParams), [orderId, searchParams]);

  // Track confirmation view (placeholder — wire to backend / Sheets later)
  useEffect(() => {
    if (!order || !order.paid) return;
    const key = `confirmation_viewed_${order.order_id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "true");
    // In production: POST { confirmation_page_viewed: true, confirmation_viewed_at: new Date().toISOString() }
    console.log("[order] confirmation_page_viewed", {
      order_id: order.order_id,
      confirmation_viewed_at: new Date().toISOString(),
    });
  }, [order]);

  // Redirect on invalid / unpaid orders
  if (!order || !order.paid) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <p className="label-eyebrow text-gold">Key of Hearts</p>
          <h1 className="font-serif text-3xl md:text-4xl text-navy">We couldn't find that order.</h1>
          <p className="text-navy/70">
            Need help?{" "}
            <a href="mailto:hello@keyofhearts.com" className="text-gold hover:underline">
              hello@keyofhearts.com
            </a>
          </p>
          <Button asChild variant="navy" size="lg">
            <a href="https://keyofhearts.com">Return home</a>
          </Button>
        </div>
      </div>
    );
  }

  const showUpload = order.tier === "preserve" && !order.audio_uploaded;
  const startUrl = `/start?tier=${order.tier}&occasion=${encodeURIComponent(order.occasion)}`;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy-deep text-cream relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-30" />
        <div className="container relative py-20 md:py-28 text-center">
          <p className="label-eyebrow text-gold mb-6">Key of Hearts</p>
          <h1 className="font-serif text-5xl md:text-7xl text-cream mb-6 text-balance">
            It's on its way.
          </h1>
          <p className="text-cream/70 text-sm md:text-base">
            Order {order.order_id} · {order.date}
          </p>
        </div>
      </header>

      {/* Order recap */}
      <section className="container py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <p className="label-eyebrow text-gold mb-6 text-center">Your Order</p>
          <div className="bg-card rounded-2xl shadow-card p-8 md:p-10 border border-gold/20">
            <SummaryRow label="Tier" value={order.tier === "signature" ? "Signature" : "Preserve"} />
            <SummaryRow label="Occasion" value={order.occasion} />
            <SummaryRow label="Product" value={PRODUCT_LABEL[order.product]} />
            <SummaryRow label="Art" value={`${order.collection} — ${order.art_name}`} />
            <SummaryRow label="Card" value={order.card_collection} />
            <SummaryRow label="Recipient" value={order.recipient_name} />
            <SummaryRow label="From" value={order.gifter_name} />
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className={cn("py-16 md:py-20", showUpload ? "bg-cream-warm" : "bg-cream-warm")}>
        <div className="container max-w-2xl">
          <h2 className="font-serif text-3xl md:text-5xl text-navy mb-8 text-balance">
            What happens next.
          </h2>
          <NextStepsCopy order={order} />

          {showUpload && (
            <div className="mt-12">
              <UploadRecording orderId={order.order_id} />
            </div>
          )}
        </div>
      </section>

      {/* Start another */}
      <section className="container py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="h-px bg-gold/20 mb-12" />
          <div className="text-center space-y-5">
            <p className="label-eyebrow text-gold">Have another someone special?</p>
            <h2 className="font-serif text-3xl md:text-4xl text-navy">Start another Key →</h2>
            <p className="text-navy/70 max-w-md mx-auto leading-relaxed">
              Your occasion and tier are pre-filled — just pick their product.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline" size="xl" className="border-gold text-gold hover:bg-gold hover:text-navy font-serif">
                <Link to={startUrl}>Find their Key →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Page footer note */}
      <section className="container pb-20 text-center space-y-2">
        <p className="text-navy/70 text-sm">
          Questions?{" "}
          <a href="mailto:hello@keyofhearts.com" className="text-gold hover:underline">
            hello@keyofhearts.com
          </a>
        </p>
        <p className="text-navy/40 text-xs">Key of Hearts by Life With Art Co.</p>
      </section>

      <Footer />
    </div>
  );
};

export default Order;
