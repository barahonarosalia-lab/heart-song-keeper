import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import luminaries from "@/assets/collection-luminaries.jpg";
import meadow from "@/assets/collection-meadow.jpg";
import botanica from "@/assets/collection-botanica.jpg";
import fable from "@/assets/collection-fable.jpg";
import ember from "@/assets/collection-ember.jpg";

type ArtCollection = {
  name: string;
  img: string;
  description: string;
  occasions: string[];
  slug: string;
  comingSoon?: boolean;
};

const artCollections: ArtCollection[] = [
  {
    name: "Little Luminaries",
    img: luminaries,
    description:
      "Soft, whimsical art anchored by wonder. For the ones who just arrived and the ones who welcomed them.",
    occasions: ["Baby & Birth", "New Parent", "Lullaby & Nursery", "Pregnancy Loss"],
    slug: "little-luminaries",
  },
  {
    name: "Meadow & Mane",
    img: meadow,
    description:
      "Bold, painterly landscapes for the moments that were earned. For the ones who showed up and kept going.",
    occasions: [
      "Military & Deployment",
      "Graduation",
      "Sobriety & Recovery",
      "Birthday",
      "Friendship",
      "Just Because",
    ],
    slug: "meadow-mane",
  },
  {
    name: "Moonlit Botanica",
    img: botanica,
    description:
      "Dark florals and candlelight. Art that holds grief with dignity — never clinical, never cold.",
    occasions: ["Memorial & Grief", "Pregnancy Loss", "Pet Memorial"],
    slug: "moonlit-botanica",
  },
  {
    name: "Fable & Fawn",
    img: fable,
    description:
      "Adult whimsy with an enchanted edge. For the one who still believes in magic — and is probably 34.",
    occasions: ["Friendship", "Just Because", "Childhood Memory"],
    slug: "fable-fawn",
    comingSoon: true,
  },
  {
    name: "Ember & Ivy",
    img: ember,
    description:
      "Candlelit and romantic. For the love that was chosen and keeps being chosen every day.",
    occasions: ["Anniversary & Wedding", "Friendship", "Just Because"],
    slug: "ember-ivy",
    comingSoon: true,
  },
];

const jewelryStyles = [
  { name: "Heart", price: "Silver from $89 · Gold from $99" },
  { name: "Circle", price: "Silver from $89 · Gold from $99" },
  { name: "Dog Tag", price: "Silver from $89 · Gold from $99" },
];

const ornaments = [
  { name: "Moonlit Botanica", desc: "Navy rose botanical wreath", price: "From $59" },
  { name: "Little Luminaries", desc: "Gold circle watercolor", price: "From $59" },
  { name: "Pet Memorial", desc: "Autumn botanical wreath", price: "From $59" },
  { name: "Classic & Elegant", desc: "Timeless wreath design", price: "From $59", comingSoon: true },
  { name: "Colorful Celebration", desc: "Joyful botanical burst", price: "From $59", comingSoon: true },
];

const CollectionsPage = () => {
  return (
    <main className="min-h-screen bg-cream text-navy">
      <Navigation />

      {/* HEADER */}
      <section className="bg-navy text-cream pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-30 pointer-events-none" />
        <div className="container relative text-center max-w-3xl mx-auto space-y-5">
          <p className="label-eyebrow text-gold">Our Collections</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream text-balance leading-[1.05]">
            Every Key starts with art.
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-cream/75">
            Choose what speaks to them.
          </p>
        </div>
      </section>

      {/* SECTION 1 — ART COLLECTIONS */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container max-w-4xl">
          <div className="text-center mb-14 space-y-3">
            <p className="label-eyebrow text-gold">The Collections</p>
            <h2 className="font-serif text-3xl md:text-5xl text-navy">
              Five worlds. Each one its own feeling.
            </h2>
          </div>

          <div className="space-y-10 md:space-y-14">
            {artCollections.map((c) => (
              <article
                key={c.slug}
                className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                  <h3 className="absolute bottom-5 left-6 md:bottom-7 md:left-8 font-serif text-3xl md:text-4xl text-gold drop-shadow-lg">
                    {c.name}
                  </h3>
                  {c.comingSoon && (
                    <span className="absolute top-5 right-5 bg-cream/95 text-navy text-[11px] tracking-[0.2em] uppercase font-medium px-3 py-1.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                <div className="p-6 md:p-8 space-y-5">
                  <p className="text-base md:text-[17px] text-muted-foreground leading-relaxed">
                    {c.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.occasions.map((o) => (
                      <span
                        key={o}
                        className="text-xs md:text-[13px] text-gold border border-gold/40 rounded-full px-3 py-1"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className={cn(
                      "border-gold text-navy hover:bg-gold hover:text-navy w-full md:w-auto",
                      c.comingSoon && "opacity-50 pointer-events-none"
                    )}
                    asChild={!c.comingSoon}
                    disabled={c.comingSoon}
                  >
                    {c.comingSoon ? (
                      <span>Explore {c.name} →</span>
                    ) : (
                      <a href={`/start?collection=${c.slug}`}>
                        Explore {c.name} <ArrowRight className="size-4" />
                      </a>
                    )}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — JEWELRY */}
      <section className="bg-navy text-cream py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-20 pointer-events-none" />
        <div className="container relative max-w-5xl">
          <div className="text-center mb-14 space-y-4">
            <p className="label-eyebrow text-gold">Jewelry</p>
            <h2 className="font-serif text-3xl md:text-5xl text-cream text-balance">
              Worn every day. Scanned whenever they need it.
            </h2>
            <p className="font-serif italic text-cream/70 text-base md:text-lg">
              Heart · Circle · Dog Tag · Silver or Gold
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-7 mb-12">
            {jewelryStyles.map((j) => (
              <article
                key={j.name}
                className="bg-cream text-navy rounded-2xl border border-gold/40 overflow-hidden shadow-card"
              >
                {/* Front */}
                <div className="p-5 border-b border-border/40">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium mb-2">
                    Front
                  </p>
                  <div className="aspect-square bg-muted rounded-xl flex items-center justify-center mb-2">
                    <span className="text-xs text-muted-foreground italic">{j.name} · front</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    QR code engraved — links to their song
                  </p>
                </div>
                {/* Back */}
                <div className="p-5">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium mb-2">
                    Back
                  </p>
                  <div className="aspect-square bg-muted rounded-xl flex items-center justify-center mb-2">
                    <span className="text-xs text-muted-foreground italic">{j.name} · back</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Two lines engraved just for them — included
                  </p>
                </div>
                <div className="px-5 pb-6 pt-2 border-t border-border/40 space-y-1.5">
                  <h3 className="font-serif text-2xl text-navy">{j.name}</h3>
                  <p className="text-sm text-navy/80">{j.price}</p>
                  <p className="text-xs text-muted-foreground">Engraving included. Free shipping.</p>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="border-gold text-cream hover:bg-gold hover:text-navy"
              asChild
            >
              <a href="/start?product=jewelry">
                Choose their jewelry <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — ORNAMENTS */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container max-w-4xl">
          <div className="text-center mb-14 space-y-3">
            <p className="label-eyebrow text-gold">Acrylic Ornaments</p>
            <h2 className="font-serif text-3xl md:text-5xl text-navy">Scan to unwrap.</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A gift box included with every order. Something they'll hang up every year.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 md:gap-7 mb-12">
            {ornaments.map((o) => (
              <article
                key={o.name}
                className={cn(
                  "bg-card rounded-2xl border border-border/50 p-5 md:p-6 text-center shadow-soft",
                  o.comingSoon && "opacity-70"
                )}
              >
                <div className="aspect-square bg-cream-warm rounded-full flex items-center justify-center mb-4 mx-auto max-w-[220px] relative">
                  <span className="text-xs text-muted-foreground italic px-2">{o.name}</span>
                  {o.comingSoon && (
                    <span className="absolute top-1 right-1 bg-navy/90 text-cream text-[9px] tracking-[0.18em] uppercase px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg md:text-xl text-navy mb-1">{o.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 leading-snug">{o.desc}</p>
                <p className="text-sm text-navy/80">{o.price}</p>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="border-gold text-navy hover:bg-gold hover:text-navy"
              asChild
            >
              <a href="/start?product=ornament">
                Choose their ornament <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 4 — BOTTOM CTA */}
      <section className="bg-navy text-cream py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-25 pointer-events-none" />
        <div className="container relative text-center max-w-2xl space-y-6">
          <h2 className="font-serif text-3xl md:text-5xl text-cream text-balance">
            Not sure where to start?
          </h2>
          <p className="font-serif italic text-cream/75 text-base md:text-lg">
            Answer a few questions and we'll find the perfect Key.
          </p>
          <div className="pt-2">
            <Button variant="gold" size="xl" asChild>
              <a href="/start">
                Find their Key <ArrowRight className="size-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CollectionsPage;
