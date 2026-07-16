import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Story",
    price: "From $49",
    tagline: "An original song, written just for them.",
  },
  {
    name: "Voice",
    price: "From $69",
    tagline: "Their voice, wrapped in music.",
  },
  {
    name: "Memory",
    price: "From $79",
    tagline: "Their video, set to music.",
  },
];

export const TierPicker = () => {
  return (
    <section className="bg-cream py-10 md:py-14">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className="rounded-lg border border-navy/10 bg-white p-5 md:p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-2xl text-navy">{t.name}</h3>
                <span className="text-sm font-sans text-gold font-medium">{t.price}</span>
              </div>
              <p className="text-sm text-navy/70 leading-relaxed flex-1">{t.tagline}</p>
              <Button variant="gold" size="sm" asChild className="w-full">
                <Link to="/start">Start {t.name}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
