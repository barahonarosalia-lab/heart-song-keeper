export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-cream text-navy">
      <div className="container relative z-10 pt-20 md:pt-28 pb-6 md:pb-8 flex items-center">
        <div className="w-full max-w-2xl space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-up text-left">
          <h1 className="font-serif text-[clamp(1.1rem,3.2vw,2.75rem)] leading-[1.05] text-navy tracking-tight text-balance whitespace-nowrap">
            The key to their <span className="italic text-gold">heart.</span> Forever.
          </h1>

          <p className="text-base md:text-lg text-navy/70 max-w-md leading-relaxed">
            A song. A voice. A story.<br />
            Behind a QR code.<br />
            On something they hold forever.
          </p>
        </div>
      </div>
    </section>
  );
};
