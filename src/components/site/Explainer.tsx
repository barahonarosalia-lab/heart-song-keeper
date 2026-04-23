export const Explainer = () => {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container max-w-4xl text-center space-y-10">
        <p className="font-serif text-2xl md:text-4xl lg:text-[44px] leading-[1.25] text-navy text-balance">
          We create an original song or preserve a voice.<br className="hidden md:inline" />
          {" "}We put it behind a QR code.<br className="hidden md:inline" />
          {" "}On something they'll hold for the rest of their life.
        </p>
        <div className="flex justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
      </div>
    </section>
  );
};
