export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-cream text-navy">
      <div className="container pt-20 md:pt-28 pb-0">
        <div className="w-full max-w-2xl space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-up text-left">
          <h1 className="font-serif text-[clamp(1.1rem,3.2vw,2.75rem)] leading-[1.05] text-navy tracking-tight text-balance whitespace-nowrap">
            The key to their <span className="italic text-gold">heart.</span> Forever.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-navy/70 max-w-md leading-relaxed">
            Behind a QR code.<br />
            On something they hold forever.
          </p>
        </div>

        <div className="mt-8 md:mt-10 rounded-2xl overflow-hidden shadow-xl border border-gold/10 mb-0">
          <img
            src="https://assets.keyofhearts.com/koh-composites/marketing-mockups/homepage-mockup.jpg"
            alt="Framed Key of Hearts prints displayed in a living room"
            className="w-full aspect-[21/9] object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
        </div>
      </div>
    </section>
  );
};
