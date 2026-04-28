import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { ExternalLink } from "lucide-react";

type Partner = {
  occasion: string;
  name: string;
  url: string;
  why: string;
};

const partners: Partner[] = [
  {
    occasion: "Military & Deployment",
    name: "Fisher House Foundation",
    url: "https://fisherhouse.org",
    why: "Because no military family should face a medical crisis alone — Fisher House provides a home away from home while loved ones receive care.",
  },
  {
    occasion: "Memorial & Grief",
    name: "TAPS — Tragedy Assistance Program for Survivors",
    url: "https://www.taps.org",
    why: "For the families of America's fallen heroes — TAPS offers compassionate care, peer support, and a place to remember.",
  },
  {
    occasion: "Pregnancy Loss",
    name: "Now I Lay Me Down to Sleep",
    url: "https://www.nowilaymedowntosleep.org",
    why: "For families honoring the briefest of lives — NILMDTS gifts the gift of remembrance photography to grieving parents.",
  },
  {
    occasion: "Baby & Birth · Lullaby & Nursery · New Parent",
    name: "March of Dimes",
    url: "https://www.marchofdimes.org",
    why: "So every baby gets the healthiest possible start — March of Dimes leads the fight for the health of all moms and babies.",
  },
  {
    occasion: "Sobriety & Recovery",
    name: "Faces & Voices of Recovery",
    url: "https://facesandvoicesofrecovery.org",
    why: "Because recovery deserves to be celebrated out loud — they organize and mobilize the recovery community across the country.",
  },
  {
    occasion: "Pet Memorial",
    name: "Best Friends Animal Society",
    url: "https://bestfriends.org",
    why: "In honor of the companions who shaped us — Best Friends works toward a day when no animal is killed in America's shelters.",
  },
  {
    occasion: "All other occasions",
    name: "Feeding America",
    url: "https://www.feedingamerica.org",
    why: "Because the most universal kindness is making sure no neighbor goes hungry — Feeding America connects people with food and hope.",
  },
];

const Giving = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      {/* HEADER */}
      <header className="bg-navy pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-20" />
        <div className="container relative text-center max-w-3xl">
          <p className="label-eyebrow text-gold mb-5">GIVING BACK</p>
          <h1 className="font-serif text-cream text-4xl md:text-6xl leading-[1.1] mb-5">
            Key of Hearts Gives Back.
          </h1>
          <p className="font-serif italic text-cream/80 text-lg md:text-xl">
            Every Key carries a moment. A portion of every order carries it forward —
            to organizations doing the quiet, essential work behind the occasions we honor.
          </p>
        </div>
      </header>

      <main className="pb-24">
        {/* Running total banner */}
        <section className="container max-w-3xl -mt-10 md:-mt-14 relative">
          <div className="bg-cream rounded-3xl border-2 border-gold/40 shadow-card p-6 md:p-8 text-center">
            <p className="font-serif text-navy text-xl md:text-2xl leading-snug">
              🤍 $0 donated to our giving partners in 2026 — and counting.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground italic mt-2">
              Updated monthly.
            </p>
          </div>
        </section>

        {/* Partners */}
        <section className="container max-w-3xl mt-16 md:mt-20">
          <div className="text-center mb-10 md:mb-14">
            <p className="label-eyebrow text-gold mb-3">OUR GIVING PARTNERS</p>
            <h2 className="font-serif text-navy text-3xl md:text-4xl leading-tight">
              Paired with intention.
            </h2>
          </div>

          <ul className="space-y-5">
            {partners.map((p) => (
              <li
                key={p.name}
                className="rounded-2xl bg-card border border-border/60 p-6 md:p-7 hover:border-gold/60 transition-colors"
              >
                <p className="label-eyebrow text-gold mb-2">{p.occasion}</p>
                <h3 className="font-serif text-navy text-xl md:text-2xl mb-3">
                  {p.name}
                </h3>
                <p className="text-navy/80 leading-relaxed mb-4">{p.why}</p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-gold hover:text-gold-deep text-sm font-medium border-b border-gold/40 hover:border-gold transition-colors"
                >
                  Visit {new URL(p.url).hostname.replace(/^www\./, "")}
                  <ExternalLink className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>

          <p className="text-center text-sm text-muted-foreground italic mt-12 max-w-xl mx-auto leading-relaxed">
            Key of Hearts is not formally affiliated with these organizations.
            We support their work because it aligns with the moments we help families honor.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Giving;
