import { Instagram, Music2, Youtube } from "lucide-react";

const cols = [
  { title: "Shop", links: ["Collections", "Products", "Gift Cards"] },
  { title: "Learn", links: ["How it works", "FAQ", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Accessibility"] },
];

export const Footer = () => {
  return (
    <footer className="bg-navy-deep text-cream pt-20 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 starfield opacity-20" />

      <div className="container relative">
        {/* Top: logo + tagline */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-serif text-3xl md:text-4xl text-cream mb-4">Key of Hearts</p>
          <p className="font-serif italic text-cream/60 text-base md:text-lg leading-relaxed">
            Every Key of Hearts is original.<br />
            Made once. For one person. Forever.
          </p>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14 max-w-3xl mx-auto">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="label-eyebrow text-gold mb-4">{c.title}</p>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-cream/70 hover:text-gold transition-colors text-sm">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="label-eyebrow text-gold mb-4">Connect</p>
            <a href="mailto:hello@keyofhearts.com" className="text-cream/70 hover:text-gold transition-colors text-sm block mb-4">
              hello@keyofhearts.com
            </a>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Instagram className="size-4" />
              </a>
              <a href="#" aria-label="TikTok" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Music2 className="size-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Youtube className="size-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-cream/10 mb-8" />

        <div className="text-center text-xs md:text-sm text-cream/50 space-y-2">
          <p>© 2026 Life With Art Co. · Key of Hearts™</p>
          <p>🇺🇸 Free US shipping on every order. · 🌍 International shipping calculated at checkout.</p>
        </div>
      </div>
    </footer>
  );
};
