import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

const steps = [
  {
    n: "01",
    title: "Choose their occasion",
    body: "Every Key of Hearts starts with a moment. A birth. A loss. A deployment. An anniversary. 15 occasions — each with its own art and song.",
  },
  {
    n: "02",
    title: "Choose their gift",
    body: "Digital download, canvas, ornament, jewelry, or blanket. Every product carries a QR code linked to their song. Free shipping on every US order.",
  },
  {
    n: "03",
    title: "Choose their art",
    body: "Pick from five collections — each a distinct emotional world. The art goes on their product and on their card.",
  },
  {
    n: "04",
    title: "Choose their card art",
    body: "Every order includes a card. Frameable. Keepsake quality. Their QR code inside. Pick the art that speaks to them.",
  },
  {
    n: "05",
    title: "Make it theirs",
    body: "Tell us their name, your relationship, and anything you want us to know. We write a personal card message — or use your exact words.",
  },
  {
    n: "06",
    title: "We do the rest",
    body: "Within 48 hours your Key is ready. Their QR goes live the moment your order is placed — always playing something beautiful.",
  },
];

const qrFeatures = [
  {
    icon: "🔑",
    text: "Always live — from the moment your order is placed",
  },
  {
    icon: "🔄",
    text: "Upgradeable — add their voice anytime for $20",
  },
  {
    icon: "🛡️",
    text: "Protected — 90 days notice + full audio download if anything ever changes",
  },
];

export default function HowItWorks() {
  return (
    <main className="min-h-dvh bg-cream text-navy">
      <Navigation />

      {/* ── HEADER ── */}
      <section className="relative bg-navy text-cream pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 starfield opacity-30" />
        <div className="container relative text-center max-w-3xl mx-auto space-y-5">
          <p className="label-eyebrow text-gold">HOW IT WORKS</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white text-balance leading-[1.1]">
            A few choices. Then we do the rest.
          </h1>
          <p className="text-cream/70 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            From your first click to the moment they scan — here&apos;s what happens.
          </p>
        </div>
      </section>

      {/* ── SECTION 1: THE TWO PATHS ── */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy text-balance text-center mb-14 md:mb-20">
            First — choose their experience.
          </h2>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Signature */}
            <div className="relative rounded-3xl p-8 md:p-10 bg-white border border-navy/10 shadow-soft overflow-hidden">
              <p className="label-eyebrow text-gold mb-4">SIGNATURE</p>
              <h3 className="font-serif text-2xl md:text-3xl text-navy mb-4 text-balance">
                We compose their song
              </h3>
              <p className="text-navy/70 leading-relaxed mb-5">
                We&apos;ve created original songs for every occasion — instrumental, humming, and with lyrics. Preview three and pick the one that feels like them. From $29.
              </p>
              <p className="text-gold italic text-[15px]">
                · Instrumental · Humming · With Lyrics
              </p>
            </div>

            {/* Preserve */}
            <div className="relative rounded-3xl p-8 md:p-10 bg-navy text-cream border border-gold/30 shadow-card overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
              <p className="label-eyebrow text-gold mb-4 relative">PRESERVE</p>
              <h3 className="font-serif text-2xl md:text-3xl text-cream mb-4 text-balance relative">
                We preserve their voice
              </h3>
              <p className="text-cream/70 leading-relaxed mb-5 relative">
                Upload any recording — a voicemail, vows, a bedtime story. We wrap it in an original score composed just for this moment. No one else has this song. From $49.
              </p>
              <p className="text-gold italic text-[15px] relative">
                · Voicemail · Vows · Bedtime stories · Deployment recordings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE STEPS ── */}
      <section className="bg-cream py-20 md:py-28 border-t border-navy/5">
        <div className="container max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy text-balance text-center mb-14 md:mb-20">
            Then it&apos;s just a few choices.
          </h2>

          <div className="relative space-y-10 md:space-y-0">
            {/* Vertical line on desktop */}
            <div className="hidden md:block absolute left-[2.25rem] top-4 bottom-4 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />

            {steps.map((s, i) => (
              <div key={s.n} className="md:flex gap-8 md:gap-12 items-start">
                <div className="flex md:block items-center gap-4 mb-3 md:mb-0 md:w-20 shrink-0">
                  <div className="font-serif text-gold text-4xl md:text-5xl leading-none">{s.n}</div>
                  {/* Mobile connector */}
                  {i < steps.length - 1 && (
                    <div className="md:hidden flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-serif text-xl md:text-2xl text-navy mb-2 leading-snug text-balance">
                    {s.title}
                  </h3>
                  <p className="text-navy/60 leading-relaxed text-[15px] md:text-base">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE CARD ── */}
      <section className="relative bg-navy text-cream py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 starfield opacity-20" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="container relative max-w-3xl mx-auto text-center space-y-6">
          <p className="label-eyebrow text-gold">INCLUDED WITH EVERY ORDER</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white text-balance leading-[1.1]">
            The card is where it begins.
          </h2>
          <div className="space-y-4 text-cream/70 leading-relaxed text-[17px] max-w-xl mx-auto">
            <p>
              Before they unwrap anything. Before they scan anything. They read it.
            </p>
            <p>
              A personal message written just for them. Their QR code inside. On thick matte stock that feels like an invitation — not a receipt.
            </p>
            <p>
              Frameable. Keepsake quality. Something they&apos;ll tuck into a wedding album, a memory box, or a drawer they open when they need to feel it again.
            </p>
          </div>
          <p className="text-gold/90 text-sm leading-relaxed pt-2">
            Included with every Key of Hearts. Physical orders receive a printed card. Digital orders receive a beautiful PDF card by email — ready to print or frame.
          </p>
        </div>
      </section>

      {/* ── SECTION 4: THE QR ── */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <p className="label-eyebrow text-gold">THE QR CODE</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy text-balance leading-[1.1]">
              It never stops working.
            </h2>
            <p className="text-navy/60 leading-relaxed text-[17px] max-w-2xl mx-auto">
              Every Key of Hearts includes a unique QR code. Scan it and their song plays — every time. We&apos;re committed to keeping every Key alive for as long as we exist. If that ever changes, you&apos;ll have 90 days notice and a full download of your audio file — so their voice is always yours to keep, no matter what.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {qrFeatures.map((f) => (
              <div
                key={f.text}
                className="rounded-2xl p-6 md:p-8 bg-white border border-navy/5 shadow-soft text-center space-y-3"
              >
                <div className="text-3xl">{f.icon}</div>
                <p className="text-navy/80 text-[15px] leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: BOTTOM CTA ── */}
      <section className="bg-navy text-cream py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-20" />
        <div className="container relative text-center space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white text-balance leading-[1.1]">
            Ready to find their Key?
          </h2>
          <div>
            <Button variant="gold" size="lg" asChild>
              <a href="/start">
                Start now <ArrowRight className="size-5" />
              </a>
            </Button>
          </div>
          <p className="text-cream/50 text-sm">
            Free shipping · Made with care · Delivered with intention
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
