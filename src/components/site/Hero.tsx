export const Hero = () => {
  return (
    <section className="relative min-h-[55vh] md:min-h-[60vh] overflow-hidden bg-gradient-navy text-cream pt-8 md:pt-12">
      {/* Starfield layers */}
      <div className="absolute inset-0 starfield opacity-80 animate-twinkle" />
      <div className="absolute inset-0 starfield opacity-50" style={{ animationDelay: "1.5s" }} />

      {/* Soft gold glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="container relative z-10 py-10 md:py-14 flex items-center">
        <div className="w-full max-w-2xl space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-up text-left">
          <h1 className="font-serif text-[clamp(1.1rem,3.2vw,2.75rem)] leading-[1.05] text-cream tracking-tight text-balance whitespace-nowrap">
            The key to their <span className="italic text-gold">heart.</span> Forever.
          </h1>

          <p className="text-lg md:text-xl text-cream/60 max-w-md leading-relaxed">
            A song. A voice. A story.<br />
            Behind a QR code.<br />
            On something they hold forever.
          </p>

          <div className="pt-2">
            <a
              href="/upgrade"
              className="text-xs italic text-cream/70 hover:text-cream transition-colors underline underline-offset-2"
            >
              Already have a Key of Hearts? Upgrade it →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade to cream */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-cream pointer-events-none" />
    </section>
  );
};
