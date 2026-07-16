export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-cream text-navy pt-8 md:pt-12">
      <div className="container relative z-10 py-8 md:py-10 flex items-center">
        <div className="w-full max-w-2xl space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-up text-left">
          <h1 className="font-serif text-[clamp(1.1rem,3.2vw,2.75rem)] leading-[1.05] text-navy tracking-tight text-balance whitespace-nowrap">
            The key to their <span className="italic text-gold">heart.</span> Forever.
          </h1>

          <p className="text-lg md:text-xl text-navy/70 max-w-md leading-relaxed">
            A song. A voice. A story.<br />
            Behind a QR code.<br />
            On something they hold forever.
          </p>

          <div className="pt-2">
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
