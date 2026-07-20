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
    <section className="pt-0 pb-8 md:pb-12">
      <div className="container">
        <div className="max-w-3xl mx-auto -mt-20 md:-mt-28 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {tiers.map((t) => (
              <div
                key={t.name}
                className="rounded-lg border border-navy/10 bg-white p-5 md:p-6 flex flex-col gap-2 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif text-xl text-navy">{t.name}</h3>
                  <span className="text-xs font-sans text-gold font-medium">{t.price}</span>
                </div>
                <p className="text-sm text-navy/70 leading-relaxed flex-1">{t.tagline}</p>
                <Button variant="gold" size="lg" asChild className="w-full text-base font-semibold">
                  <Link to="/start">Start {t.name}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-5 text-center">
            <a
              href="/upgrade"
              className="text-xs italic text-navy/70 hover:text-navy transition-colors underline underline-offset-2"
            >
              Already have a Key of Hearts? Upgrade it →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
