import { ArrowRight } from "lucide-react";
import luminaries from "@/assets/collection-luminaries.jpg";
import meadow from "@/assets/collection-meadow.jpg";
import fable from "@/assets/collection-fable.jpg";
import botanica from "@/assets/collection-botanica.jpg";
import ember from "@/assets/collection-ember.jpg";

const collections = [
  {
    name: "Little Luminaries",
    img: luminaries,
    body: "Soft, whimsical, and deeply loved. Anchored by Punch — the real baby macaque who went viral for clinging to his stuffed orangutan. For baby, birth, lullaby, new parent, and pregnancy loss occasions.",
  },
  {
    name: "Meadow & Mane",
    img: meadow,
    body: "Bold landscapes and animals that feel earned. Wide skies, golden fields, rugged wilderness. The kind of art a man would actually hang on his wall. For military, graduation, sobriety, childhood memory, and milestone occasions.",
  },
  {
    name: "Fable & Fawn",
    img: fable,
    body: "Adult whimsy with an enchanted edge. Moonlit foxes, glowing cottages, botanical charm. The world of someone who believes in magic but is 34. For friendship, just because, and childhood memory occasions.",
  },
  {
    name: "Moonlit Botanica",
    img: botanica,
    body: "Dark florals, candlelight, and quiet reverence. Art that holds grief with dignity — never clinical, never cold. For memorial, grief, and pregnancy loss occasions.",
  },
  {
    name: "Ember & Ivy",
    img: ember,
    body: "Warm, intimate, and romantic. Candlelit gardens, paired foxes, cottage roses. The feeling of being chosen and staying chosen. For anniversary, wedding, deep friendship, and cat lovers.",
  },
];

export const Collections = () => {
  return (
    <section id="collections" className="bg-cream py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16 space-y-5">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy text-balance">
            Find their <span className="italic text-gold">collection</span>
          </h2>
          <p className="text-base md:text-lg text-navy/70 leading-relaxed">
            Any art for any occasion. Choose what speaks to them — not what the calendar says.
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden -mx-6 px-6 overflow-x-auto scrollbar-none pb-4">
          <div className="flex gap-5 snap-x snap-mandatory">
            {collections.map((c) => (
              <CollectionCard key={c.name} {...c} mobile />
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {collections.map((c) => (
            <CollectionCard key={c.name} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CollectionCard = ({
  name,
  img,
  body,
  mobile = false,
}: {
  name: string;
  img: string;
  body: string;
  mobile?: boolean;
}) => (
  <article
    className={`group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 border border-border/40 flex flex-col ${
      mobile ? "min-w-[85vw] snap-center" : ""
    }`}
  >
    <div className="aspect-[4/5] overflow-hidden bg-muted">
      <img
        src={img}
        alt={name}
        loading="lazy"
        width={800}
        height={1024}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div className="p-6 md:p-7 flex flex-col flex-1">
      <h3 className="font-serif text-2xl md:text-[28px] text-navy mb-3">{name}</h3>
      <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 flex-1">{body}</p>
      <a
        href={`#${name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-navy group-hover:text-gold transition-colors"
      >
        Explore {name}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  </article>
);
