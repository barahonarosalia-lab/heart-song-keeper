import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigation } from "@/components/site/Navigation";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { UPGRADE_PRICE_ID } from "@/lib/pricing";

// ----- Types -----
type Tier = "signature" | "preserve";
type ProductId = "digital" | "canvas" | "ornament" | "jewelry" | "blanket" | "photo_blanket";

interface ExistingOrder {
  order_id: string;
  recipient_name: string;
  occasion: string;
  product: ProductId;
  tier: Tier;
  music_style: string | null;
}

const PRODUCT_LABEL: Record<ProductId, string> = {
  digital: "Digital Download",
  canvas: "Canvas Print",
  ornament: "Heirloom Ornament",
  jewelry: "Engraved Jewelry",
  blanket: "KOH Art Blanket",
  photo_blanket: "Photo Blanket",
};

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

// Mock order lookup — in production this hits the backend.
// For testing: any code starting with "KOH-" returns a sample order.
// Use "KOH-PRESERVE" to test the Preserve case (music_style already set).
const lookupOrder = (orderNumber: string): ExistingOrder | null => {
  const normalized = orderNumber.trim().toUpperCase();
  if (!normalized.startsWith("KOH-")) return null;
  const isPreserve = normalized.includes("PRESERVE");
  return {
    order_id: normalized,
    recipient_name: "Karen",
    occasion: "Memorial & Grief",
    product: "canvas",
    tier: isPreserve ? "preserve" : "signature",
    music_style: isPreserve ? "Soft Piano" : null,
  };
};

const Section = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => (
  <section id={id} className={cn("py-16 md:py-24", className)}>
    <div className="container max-w-3xl">{children}</div>
  </section>
);

const Step = ({ n, title, body }: { n: string; title: string; body: string }) => (
  <div className="space-y-2">
    <p className="font-serif text-gold text-4xl md:text-5xl leading-none">{n}</p>
    <h3 className="font-serif text-navy text-xl md:text-2xl">{title}</h3>
    <p className="text-muted-foreground text-base leading-relaxed">{body}</p>
  </div>
);

const Upgrade = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [lookupAttempted, setLookupAttempted] = useState(false);
  const [foundOrder, setFoundOrder] = useState<ExistingOrder | null>(null);

  const [audioUrl, setAudioUrl] = useState("");
  const [whoseVoice, setWhoseVoice] = useState("");
  const [musicStyle, setMusicStyle] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [isPaying] = useState(false);
  const [confirmed] = useState(false);

  const { openCheckout, checkoutElement } = useStripeCheckout();

  const needsMusicStyle = foundOrder && !foundOrder.music_style;
  const wasSignature = foundOrder?.tier === "signature";

  const canSubmit = useMemo(() => {
    if (!foundOrder) return false;
    if (!audioUrl) return false;
    if (!whoseVoice.trim()) return false;
    if (!consent) return false;
    if (needsMusicStyle && !musicStyle) return false;
    return true;
  }, [foundOrder, audioUrl, whoseVoice, consent, needsMusicStyle, musicStyle]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const order = lookupOrder(orderNumber);
    setFoundOrder(order);
    setLookupAttempted(true);
    // Reset upgrade fields when looking up a new order
    if (order) {
      setAudioUrl("");
      setWhoseVoice("");
      setMusicStyle(null);
      setConsent(false);
    }
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
  };

  const handlePay = () => {
    if (!canSubmit || !foundOrder) return;
    openCheckout({
      priceId: UPGRADE_PRICE_ID,
      metadata: {
        flow: "upgrade",
        original_order_id: foundOrder.order_id,
        whose_voice: whoseVoice,
        music_style: musicStyle ?? foundOrder.music_style ?? "",
      },
      returnUrl: `${window.location.origin}/order/{CHECKOUT_SESSION_ID}?upgrade=${encodeURIComponent(foundOrder.order_id)}`,
    });
  };

  // ----- CONFIRMED STATE -----
  if (confirmed && foundOrder) {
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <main className="min-h-dvh bg-cream flex flex-col">
        <Navigation />
        <section className="bg-navy text-cream flex-1 flex items-center py-24 md:py-32 pt-32 md:pt-40">
          <div className="container max-w-2xl text-center space-y-8">
            <p className="label-eyebrow text-gold">UPGRADE CONFIRMED</p>
            <h1 className="font-serif text-5xl md:text-7xl text-cream text-balance">
              We have it.
            </h1>
            <p className="text-cream/80 text-lg md:text-xl leading-relaxed font-light max-w-xl mx-auto">
              Their recording is in our hands. We'll have their voice live within 48 hours.
              You'll hear from us the moment it's ready.
            </p>
            <p className="text-gold text-sm pt-4">
              Order {foundOrder.order_id} · Upgrade confirmed · {dateStr}
            </p>
          </div>
        </section>
        <footer className="py-8 text-center text-sm text-muted-foreground space-y-1">
          <p>
            Questions?{" "}
            <a href="mailto:hello@keyofhearts.com" className="text-navy hover:text-gold">
              hello@keyofhearts.com
            </a>
          </p>
          <p className="text-xs opacity-70">Key of Hearts by Life With Art Co.</p>
        </footer>
      </main>
    );
  }

  // ----- DEFAULT STATE -----
  return (
    <main className="min-h-dvh bg-cream">
      <Navigation />
      {/* Header */}
      <header className="bg-navy text-cream pt-32 md:pt-40 pb-20 md:pb-28">
        <div className="container max-w-3xl text-center space-y-5">
          <p className="label-eyebrow text-gold">UPGRADE YOUR KEY</p>
          <h1 className="font-serif text-5xl md:text-7xl text-cream text-balance">
            Add their voice.
          </h1>
          <p className="text-cream/80 text-lg md:text-xl font-light italic">
            Your QR. Their words. Forever.
          </p>
        </div>
      </header>

      {/* How it works */}
      <Section className="border-b border-gold/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <Step n="01" title="Enter your order number" body="We'll find your Key." />
          <Step
            n="02"
            title="Upload their recording"
            body="Any voice. Any moment. Up to 50MB."
          />
          <Step
            n="03"
            title="We do the rest"
            body="Your QR updates within 48 hours."
          />
        </div>
      </Section>

      {/* Order lookup */}
      <Section>
        <form onSubmit={handleLookup} className="space-y-4 max-w-xl mx-auto">
          <label htmlFor="order-number" className="label-eyebrow text-gold block">
            YOUR ORDER NUMBER
          </label>
          <Input
            id="order-number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. KOH-001"
            className="h-12 rounded-xl bg-card border-border/60 text-base"
          />
          <Button type="submit" variant="gold" size="lg" className="w-full">
            Find my Key <ArrowRight className="size-4" />
          </Button>
          {lookupAttempted && !foundOrder && (
            <p className="text-rose text-sm leading-relaxed pt-2">
              We couldn't find that order. Check your confirmation email for your order
              number, or email us at{" "}
              <a href="mailto:hello@keyofhearts.com" className="underline">
                hello@keyofhearts.com
              </a>
            </p>
          )}
        </form>

        {/* Order confirmation card */}
        {foundOrder && (
          <div className="mt-10 max-w-xl mx-auto rounded-2xl border border-gold/30 bg-card p-6 md:p-8 shadow-soft animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start gap-3 mb-5">
              <CheckCircle2 className="size-5 text-gold mt-0.5" />
              <p className="font-serif text-navy text-xl">{foundOrder.order_id}</p>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <p className="text-muted-foreground">Recipient</p>
              <p className="text-navy font-medium">{foundOrder.recipient_name}</p>
              <p className="text-muted-foreground">Occasion</p>
              <p className="text-navy font-medium">{foundOrder.occasion}</p>
              <p className="text-muted-foreground">Product</p>
              <p className="text-navy font-medium">
                {PRODUCT_LABEL[foundOrder.product]}
              </p>
              <p className="text-muted-foreground">Current tier</p>
              <p className="text-navy font-medium capitalize">{foundOrder.tier}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-5 pt-5 border-t border-border/60">
              Is this your order? Upload their recording below.
            </p>
          </div>
        )}
      </Section>

      {/* Upload + details — only after order found */}
      {foundOrder && (
        <>
          <Section className="bg-cream-warm">
            <div className="space-y-10 max-w-xl mx-auto">
              {/* Audio upload */}
              <div className="space-y-4">
                <p className="label-eyebrow text-gold">THEIR RECORDING</p>
                <label
                  htmlFor="upgrade-audio-file"
                  className={cn(
                    "block rounded-2xl border-2 border-dashed p-8 md:p-10 text-center cursor-pointer transition-all bg-card/50",
                    audioUrl
                      ? "border-gold bg-gold/5"
                      : "border-border hover:border-gold hover:bg-gold/5",
                  )}
                >
                  <input
                    id="upgrade-audio-file"
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/x-m4a,audio/mp4,.mp3,.wav,.m4a"
                    className="sr-only"
                    onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <span className="inline-flex items-center justify-center size-12 rounded-full bg-gold/15 text-gold">
                      <UploadCloud className="size-6" />
                    </span>
                    {audioUrl ? (
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

                {/* Legal consent */}
                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked === true)}
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

              {/* Whose voice */}
              <div className="space-y-3">
                <label htmlFor="whose-voice" className="label-eyebrow text-gold block">
                  WHOSE VOICE IS THIS?
                </label>
                <Input
                  id="whose-voice"
                  value={whoseVoice}
                  onChange={(e) => setWhoseVoice(e.target.value)}
                  placeholder="e.g. My grandmother Ruth, our dog Cooper"
                  className="h-12 rounded-xl bg-card border-border/60 text-base"
                />
              </div>

              {/* Music style — only if not already set on original order */}
              {needsMusicStyle && (
                <div className="space-y-4">
                  <p className="label-eyebrow text-gold">BACKGROUND MUSIC STYLE</p>
                  <div className="flex flex-wrap gap-2.5">
                    {MUSIC_STYLES.map((style) => {
                      const selected = musicStyle === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setMusicStyle(style)}
                          className={cn(
                            "rounded-full px-4 h-10 text-sm font-medium border transition-all",
                            selected
                              ? "bg-gold text-navy border-gold shadow-gold"
                              : "bg-card text-navy border-border/60 hover:border-gold",
                          )}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    We'll compose an original score around their voice.
                  </p>
                </div>
              )}
            </div>
          </Section>

          {/* Price + CTA */}
          <Section>
            <div className="max-w-xl mx-auto text-center space-y-6">
              {wasSignature && (
                <div className="rounded-2xl bg-navy/5 border border-navy/10 p-5 text-navy text-base leading-relaxed">
                  This upgrade adds a voice recording to your Signature Key — making it a{" "}
                  <span className="font-serif italic text-gold">Preserve</span>{" "}
                  experience.
                </div>
              )}

              <div className="space-y-1 pt-4">
                <p className="font-serif text-6xl md:text-7xl text-navy">$20</p>
                <p className="text-sm text-muted-foreground">
                  One time · No subscription
                </p>
              </div>

              <p className="text-sm text-muted-foreground italic max-w-md mx-auto leading-relaxed">
                Your original song is archived before anything changes. You'll receive it
                by email first.
              </p>

              <Button
                variant="gold"
                size="xl"
                className="w-full"
                disabled={!canSubmit || isPaying}
                onClick={handlePay}
              >
                {isPaying ? "Processing…" : "Upgrade their Key"}
                {!isPaying && <ArrowRight className="size-4" />}
              </Button>
            </div>
          </Section>
        </>
      )}

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-muted-foreground space-y-1 border-t border-border/40">
        <p>
          Questions?{" "}
          <a href="mailto:hello@keyofhearts.com" className="text-navy hover:text-gold">
            hello@keyofhearts.com
          </a>
        </p>
        <p className="text-xs opacity-70">Key of Hearts by Life With Art Co.</p>
      </footer>
      {checkoutElement}
    </main>
  );
};

export default Upgrade;
