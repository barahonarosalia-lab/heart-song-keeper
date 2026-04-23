import { useEffect, useState } from "react";

const quotes = [
  "She lost her son in March. This Christmas his voice will be on their tree.",
  "He's deployed. Every night his daughter scans the blanket. He reads her a story.",
  "I'm a terrible gift giver. This is the first gift I've given that made someone cry — in the good way.",
];

export const EmotionalProof = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % quotes.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative bg-navy-deep text-cream py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 starfield opacity-25" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-gold/[0.04] blur-3xl" />

      <div className="container relative max-w-4xl mx-auto">
        <div className="relative min-h-[280px] md:min-h-[260px] flex items-center justify-center">
          {quotes.map((q, i) => (
            <blockquote
              key={i}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-1000 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="font-serif text-gold text-7xl md:text-8xl leading-none mb-4 select-none">
                "
              </span>
              <p className="font-serif italic text-2xl md:text-4xl lg:text-[44px] leading-[1.3] text-cream text-balance px-4">
                {q}
              </p>
            </blockquote>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Quote ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-8 bg-gold" : "w-1.5 bg-cream/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
