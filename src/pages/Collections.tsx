import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { SwipeRow } from "@/components/site/SwipeRow";
import { CollectionGalleryOverlay } from "@/components/site/CollectionGalleryOverlay";
import { cn } from "@/lib/utils";
import luminaries from "@/assets/collection-luminaries.jpg";
import meadow from "@/assets/collection-meadow.jpg";
import botanica from "@/assets/collection-botanica.jpg";
import fable from "@/assets/collection-fable.jpg";
import ember from "@/assets/collection-ember.jpg";
import blanketPhoto from "@/assets/blanket-photo.jpg";
import blanketArt from "@/assets/blanket-art.jpg";

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

const blankets = [
  {
    label: "PHOTO BLANKET",
    img: blanketPhoto,
    description: "Your photo. Full bleed. Their song behind a QR in every corner.",
    price: "From $119",
    note: "Upload your photo at checkout",
  },
  {
    label: "KOH ART BLANKET",
    img: blanketArt,
    description: "Choose from our art collections. Every corner carries their QR.",
    price: "From $119",
    note: null,
  },
];

const ornaments = [
  { name: "Moonlit Botanica", desc: "Navy rose botanical wreath", price: "From $59" },
  { name: "Little Luminaries", desc: "Gold circle watercolor", price: "From $59" },
  { name: "Pet Memorial", desc: "Autumn botanical wreath", price: "From $59" },
  { name: "Classic & Elegant", desc: "Timeless wreath design", price: "From $59", comingSoon: true },
  { name: "Colorful Celebration", desc: "Joyful botanical burst", price: "From $59", comingSoon: true },
];

const CollectionsPage = () => {
  const [activeCollection, setActiveCollection] = useState<ArtCollection | null>(null);

  return (
    <main className="min-h-screen bg-cream text-navy">
      <Navigation />

      <CollectionGalleryOverlay
        collection={activeCollection}
        onClose={() => setActiveCollection(null)}
      />

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
        <div className="container max-w-6xl">
          <div className="text-center mb-14 space-y-3">
            <p className="label-eyebrow text-gold">The Collections</p>
            <h2 className="font-serif text-3xl md:text-5xl text-navy">
              Five worlds. Each one its own feeling.
            </h2>
          </div>

          <SwipeRow basis="basis-[75%] md:basis-[45%] lg:basis-[33%]">
            {artCollections.map((c) => (
              <article
                key={c.slug}
                onClick={() => setActiveCollection(c)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveCollection(c);
                  }
                }}
                role="button"
                tabIndex={0}
                className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50 h-full flex flex-col cursor-pointer transition-all hover:shadow-card hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 font-serif text-2xl md:text-3xl text-gold drop-shadow-lg">
                    {c.name}
                  </h3>
                  {c.comingSoon && (
                    <span className="absolute top-4 right-4 bg-cream/95 text-navy text-[10px] tracking-[0.2em] uppercase font-medium px-2.5 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                <div className="p-5 md:p-6 space-y-4 flex-1 flex flex-col">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {c.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.occasions.map((o) => (
                      <span
                        key={o}
                        className="text-[11px] md:text-xs text-gold border border-gold/40 rounded-full px-2.5 py-0.5"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-2">
                    <Button
                      variant="outline"
                      className={cn(
                        "border-gold text-navy hover:bg-gold hover:text-navy w-full",
                        c.comingSoon && "opacity-60"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCollection(c);
                      }}
                    >
                      Explore {c.name} <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </SwipeRow>
        </div>
      </section>

      {/* SECTION 2 — JEWELRY */}
      <section className="bg-navy text-cream py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-20 pointer-events-none" />
        <div className="container relative max-w-6xl">
          <div className="text-center mb-14 space-y-4">
            <p className="label-eyebrow text-gold">Jewelry</p>
            <h2 className="font-serif text-3xl md:text-5xl text-cream text-balance">
              Worn every day. Scanned whenever they need it.
            </h2>
            <p className="font-serif italic text-cream/70 text-base md:text-lg">
              Heart · Circle · Dog Tag · Silver or Gold
            </p>
          </div>

          <SwipeRow basis="basis-[80%] md:basis-[45%] lg:basis-[33%]">
            {jewelryStyles.map((j) => (
              <article
                key={j.name}
                className="bg-cream text-navy rounded-2xl border border-gold/40 overflow-hidden shadow-card h-full"
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
          </SwipeRow>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="bg-cream border-gold text-navy hover:bg-gold hover:text-navy hover:border-gold"
              asChild
            >
              <a href="/start?product=jewelry">
                Choose their jewelry <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — BLANKETS */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container max-w-6xl">
          <div className="text-center mb-14 space-y-3">
            <p className="label-eyebrow text-gold">Blankets</p>
            <h2 className="font-serif text-3xl md:text-5xl text-navy">
              Wrapped in it. Every night.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Sherpa 50x60 · Free shipping · QR code woven into art
            </p>
            <p className="font-sans text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
              This blanket is designed as a keepsake to be treasured for years to come. In keeping with safe sleep guidelines, loose blankets are not recommended for infants under 12 months in sleep spaces.
            </p>
          </div>

          <SwipeRow basis="basis-[80%] md:basis-[55%] lg:basis-[45%]">
            {blankets.map((b) => (
              <article
                key={b.label}
                className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft h-full flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={b.img}
                    alt={b.label}
                    loading="lazy"
                    width={1280}
                    height={896}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col">
                  <p className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium">
                    {b.label}
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">{b.description}</p>
                  <div className="mt-auto space-y-1 pt-2">
                    <p className="font-serif text-xl text-navy">{b.price}</p>
                    {b.note && <p className="text-xs text-muted-foreground">{b.note}</p>}
                  </div>
                </div>
              </article>
            ))}
          </SwipeRow>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="bg-cream border-gold text-navy hover:bg-gold hover:text-navy"
              asChild
            >
              <a href="/start?product=blanket">
                Choose their blanket <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 4 — ORNAMENTS */}
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

      {/* SECTION 5 — BOTTOM CTA */}
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
