import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const PRESETS = [29, 49, 59, 89, 119];
const NOTE_MAX = 150;

const GiftCards = () => {
  const [amount, setAmount] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("");
  const [from, setFrom] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const finalAmount = amount;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ready = finalAmount !== null && finalAmount >= 29 && emailValid;

  const handleCheckout = async () => {
    if (!ready) return;
    setSubmitting(true);
    // Stripe checkout integration would go here.
    // For now, simulate success and reveal confirmation state.
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      {/* HEADER */}
      <header className="bg-navy pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-20" />
        <div className="container relative text-center max-w-3xl">
          <p className="label-eyebrow text-gold mb-5">GIFT CARDS</p>
          <h1 className="font-serif text-cream text-4xl md:text-6xl leading-[1.1] mb-5">
            Give them the Key.
          </h1>
          <p className="font-serif italic text-cream/80 text-lg md:text-xl mb-8">
            They choose the song. You give them the moment.
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {["Delivered instantly", "Never expires", "Any amount from $29"].map((p) => (
              <span
                key={p}
                className="px-4 py-2 rounded-full border border-gold/50 text-cream text-xs md:text-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="pb-20">
        {confirmed ? (
          <ConfirmationPanel email={email} />
        ) : (
          <section className="container max-w-2xl -mt-10 md:-mt-14 relative">
            {/* MAIN CARD */}
            <div className="bg-cream rounded-3xl border-2 border-gold/40 shadow-card p-6 md:p-10 space-y-10">
              {/* Step 1 — Amount */}
              <div className="space-y-4">
                <p className="label-eyebrow text-gold">Choose their amount</p>
                <div className="grid grid-cols-2 gap-3">
                  {PRESETS.map((amt) => {
                    const selected = amount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmount(amt);
                        }}
                        className={cn(
                          "relative rounded-2xl h-14 text-lg font-serif border-2 transition-all",
                          selected
                            ? "bg-gold text-navy border-gold shadow-gold"
                            : "bg-card text-navy border-border/60 hover:border-gold",
                        )}
                      >
                        ${amt}
                        {selected && (
                          <Check className="absolute top-2 right-2 size-4" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 — Personal */}
              <div className="space-y-5">
                <div>
                  <p className="label-eyebrow text-gold">Make it personal</p>
                  <p className="text-xs text-muted-foreground italic mt-1">
                    Optional — but they'll love it.
                  </p>
                </div>

                <div className="space-y-3">
                  <label htmlFor="gc-to" className="label-eyebrow text-gold block">To</label>
                  <Input
                    id="gc-to"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value.slice(0, 80))}
                    placeholder="Recipient's name"
                    className="h-12 rounded-xl bg-card border-border/60 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="gc-from" className="label-eyebrow text-gold block">From</label>
                  <Input
                    id="gc-from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value.slice(0, 80))}
                    placeholder="Your name"
                    className="h-12 rounded-xl bg-card border-border/60 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="gc-note" className="label-eyebrow text-gold block">A note</label>
                  <Textarea
                    id="gc-note"
                    value={note}
                    maxLength={NOTE_MAX}
                    rows={3}
                    onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
                    placeholder="e.g. For whenever you're ready to give someone something that lasts."
                    className="rounded-xl bg-card border-border/60 text-base p-4"
                  />
                  <div className="flex justify-end">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {note.length}/{NOTE_MAX}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3 — Email */}
              <div className="space-y-3">
                <label htmlFor="gc-email" className="label-eyebrow text-gold block">
                  Where should we send it?
                </label>
                <Input
                  id="gc-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="h-12 rounded-xl bg-card border-border/60 text-base"
                />
                <p className="text-xs text-muted-foreground italic">
                  Your gift card PDF arrives here instantly. Forward it, print it, or save it for the right moment.
                </p>
              </div>

              {/* Price */}
              <div className="text-center pt-2">
                <p className="font-serif text-5xl md:text-6xl text-navy">
                  ${finalAmount ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  One time · Delivered instantly · Never expires
                </p>
              </div>

              {/* CTA */}
              <Button
                type="button"
                variant="gold"
                size="xl"
                className="w-full font-serif text-lg"
                disabled={!ready || submitting}
                onClick={handleCheckout}
              >
                {submitting ? "Processing…" : "Send their gift card →"}
              </Button>
            </div>

            {/* WHAT FOR */}
            <section className="mt-16 md:mt-20 text-center">
              <h2 className="font-serif text-navy text-2xl md:text-3xl mb-8">
                What can they use it for?
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: "🎵", text: "Any song · Any occasion · Any product" },
                  { icon: "🎨", text: "Five art collections to choose from" },
                  { icon: "📦", text: "Digital · Canvas · Jewelry · Ornament · Blanket" },
                ].map((c) => (
                  <div
                    key={c.text}
                    className="rounded-2xl bg-card border border-border/60 p-5 text-left"
                  >
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <p className="text-sm text-navy/80 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/collections"
                className="inline-block mt-6 text-gold hover:text-gold-deep text-sm font-medium border-b border-gold/40 hover:border-gold transition-colors"
              >
                See everything they can choose from →
              </Link>
            </section>
          </section>
        )}
      </main>

      {/* BOTTOM CTA */}
      <section className="bg-navy py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-15" />
        <div className="container relative text-center max-w-2xl">
          <h2 className="font-serif text-cream text-3xl md:text-5xl mb-4 leading-tight">
            Know exactly what they'd love?
          </h2>
          <p className="text-cream/80 text-lg mb-8">
            Build their Key yourself — we'll make it perfect.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/start">Start their Key →</Link>
          </Button>
        </div>
      </section>

      {/* Mini footer */}
      <footer className="bg-navy-deep py-8">
        <div className="container text-center text-cream/50 text-xs md:text-sm">
          Questions?{" "}
          <a href="mailto:hello@keyofhearts.com" className="hover:text-gold transition-colors">
            hello@keyofhearts.com
          </a>{" "}
          · Key of Hearts by Life With Art Co.
        </div>
      </footer>
    </div>
  );
};

const ConfirmationPanel = ({ email }: { email: string }) => (
  <section className="container max-w-2xl -mt-10 md:-mt-14 relative animate-in fade-in slide-in-from-bottom-3 duration-500">
    <div className="bg-navy rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
      <div className="absolute inset-0 starfield opacity-20" />
      <div className="relative">
        <h2 className="font-serif text-cream text-3xl md:text-5xl mb-4 leading-tight">
          It's on its way.
        </h2>
        <p className="text-cream/80 text-base md:text-lg leading-relaxed mb-6">
          Your gift card is headed to{" "}
          <span className="text-gold">{email || "your inbox"}</span> right now.
          Forward it whenever you're ready — it never expires.
        </p>
        <p className="text-gold text-sm italic">
          Check your spam folder if it doesn't arrive within 2 minutes.
        </p>
      </div>
    </div>
  </section>
);

export default GiftCards;
