export const ScanShowcase = () => {
  return (
    <section className="bg-cream text-navy py-20 md:py-28">
      <div className="max-w-2xl mx-auto text-center px-6">
        <p className="tracking-widest uppercase text-sm text-gold mb-4">
          See it for yourself
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy">
          Scan it. Hear it. <span className="italic text-gold">Forever.</span>
        </h2>
        <p className="max-w-md mx-auto text-navy/70 mt-6 leading-relaxed">
          This is a real Key of Hearts — my husband's. Scan the QR code and hear his song, exactly the way he will every time he picks it up.
        </p>
        <div className="mt-10 max-w-[320px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-gold/20 shadow-lg">
          <video
            src="https://assets.keyofhearts.com/lv_0_20260715234222.mp4"
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};
