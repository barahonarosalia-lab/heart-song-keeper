const steps = [
  {
    n: "01",
    title: "Choose their collection",
    body: "Any art. Any occasion. You decide what speaks to them.",
  },
  {
    n: "02",
    title: "Choose their gift",
    body: "Digital · Canvas · Ornament · Jewelry · Blanket",
  },
  {
    n: "03",
    title: "Share their story or pick their song",
    body: "We do the rest within 48 business hours.",
  },
  {
    n: "04",
    title: "They scan. They feel it. Forever.",
    body: "Every time. For the rest of their life.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how" className="relative bg-navy text-cream py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 starfield opacity-30" />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream text-balance">
            Four steps. One <span className="italic text-gold">forever</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="font-serif text-gold text-5xl md:text-6xl mb-5 leading-none">{s.n}</div>
              <h3 className="font-serif text-xl md:text-2xl text-cream mb-3 leading-snug text-balance">
                {s.title}
              </h3>
              <p className="text-cream/60 leading-relaxed text-[15px]">{s.body}</p>

              {/* Connector line on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[55%] w-[80%] h-px bg-gradient-to-r from-gold/40 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
