import { Button } from "@/components/ui/button";

const products = [
  {
    name: "Digital Download",
    productId: "digital",
    price: "From $49",
    tagline: "Instant. Printable. Frameable.",
    details: [
      "High resolution art print with QR code",
      "Delivered to your inbox instantly",
      "Print at home or any print shop",
    ],
    cta: "Choose Digital",
  },
  {
    name: "Canvas Print",
    productId: "canvas",
    price: "From $99",
    tagline: "Gallery wrap. Ready to hang.",
    details: ["11x14 unframed canvas", "Ships in 4-6 business days", "Free shipping"],
    cta: "Choose Canvas",
  },
  {
    name: "Acrylic Ornament",
    productId: "ornament",
    price: "From $79",
    tagline: "A keepsake that plays their song — every time they hold it.",
    details: ["Scan it anytime · Gift box included", "Ships in 5-7 business days"],
    cta: "Choose Ornament",
  },
  {
    name: "Jewelry",
    productId: "jewelry",
    price: "From $109",
    tagline: "Worn every day. Scanned whenever they need it.",
    details: ["Heart · Round · Dog Tag", "Silver or Gold", "Ships in 5-7 business days"],
    cta: "Choose Jewelry",
  },
  {
    name: "Sherpa Blanket",
    productId: "blanket",
    price: "From $139",
    tagline: "Wrap up. Press play. They're there.",
    details: ["50x60 · Full color · Soft sherpa", "Ships in 3-5 business days"],
    cta: "Choose Blanket",
  },
];

export const Products = () => {
  return (
    <section id="products" className="bg-gradient-cream py-24 md:py-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy text-balance">
            Choose how they <span className="italic text-rose">hold it</span>
          </h2>
          <p className="text-base md:text-lg text-navy/70 leading-relaxed">
            Every Key of Hearts works on any of these.<br className="hidden sm:inline" />
            {" "}Free shipping on every order.
          </p>
          <p className="text-sm md:text-base text-navy/60 leading-relaxed">
            Prices shown are for our Story tier — Voice adds $20, Memory adds $30, on any product below.
          </p>
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden -mx-6 px-6 overflow-x-auto scrollbar-none pb-4">
          <div className="flex gap-5 snap-x snap-mandatory">
            {products.map((p) => <ProductCard key={p.name} {...p} mobile />)}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 lg:gap-6">
          {products.map((p) => <ProductCard key={p.name} {...p} />)}
        </div>

        {/* Shipping notice */}
        <div className="mt-20 max-w-2xl mx-auto text-center">
          <div className="inline-block px-8 py-6 rounded-2xl bg-cream border border-border/60">
            <p className="text-[15px] md:text-base text-navy/80 leading-relaxed">
              <span className="text-gold">🇺🇸</span> Free shipping on every US order.<br />
              <span className="text-gold">🌍</span> International customers pay shipping —
              calculated at checkout before payment. Typically $18-45 depending on destination.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({
  name, productId, price, tagline, details, cta, mobile = false,
}: {
  name: string; productId: string; price: string; tagline: string; details: string[]; cta: string; mobile?: boolean;
}) => (
  <article
    className={`group bg-card rounded-2xl p-6 md:p-7 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 border border-border/40 flex flex-col ${
      mobile ? "min-w-[78vw] snap-center" : ""
    }`}
  >
    <p className="label-eyebrow text-gold mb-3">{price}</p>
    <h3 className="font-serif text-2xl text-navy mb-3 leading-tight">{name}</h3>
    <p className="font-serif italic text-navy/70 text-base mb-5 leading-snug text-balance">
      "{tagline}"
    </p>
    <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed mb-7 flex-1">
      {details.map((d) => <li key={d}>{d}</li>)}
    </ul>
    <a href={`/start?product=${productId}`} className="w-full mt-auto">
      <Button variant="navy" size="default" className="w-full">
        {cta}
      </Button>
    </a>
  </article>
);
