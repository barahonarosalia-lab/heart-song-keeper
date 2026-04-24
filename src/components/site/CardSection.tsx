export const CardSection = () => {
  return (
    <section className="relative bg-navy text-cream py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 starfield opacity-20" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="label-eyebrow text-gold">Included with every order</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream text-balance leading-[1.05]">
            The card is where <span className="italic text-gold">it begins.</span>
          </h2>
          <div className="space-y-4 text-cream/70 leading-relaxed text-[17px] max-w-xl mx-auto">
            <p>
              Before they unwrap anything. Before they scan anything. They read it.
            </p>
            <p>
              A personal message written just for them. Their QR code inside. On
              thick matte stock that feels like an invitation — not a receipt.
            </p>
            <p>
              Frameable. Keepsake quality. Something they'll tuck into a wedding
              album, a memory box, or a drawer they open when they need to feel
              it again.
            </p>
          </div>
          <p className="text-gold/90 text-sm leading-relaxed pt-2">
            Included with every Key of Hearts. Physical orders receive a printed card. Digital orders receive a beautiful PDF card by email — ready to print or frame.
          </p>
        </div>
      </div>
    </section>
  );
};
