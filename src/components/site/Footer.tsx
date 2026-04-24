import { Instagram, Music2, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

type FooterLink = { label: string; to?: string; href?: string };

const cols: { title: string; links: FooterLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Collections", to: "/collections" },
      { label: "Products", to: "/collections" },
      { label: "Gift Cards", to: "/gift-cards" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "How it works", to: "/how-it-works" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", href: "mailto:hello@keyofhearts.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Accessibility", to: "/accessibility" },
    ],
  },
];

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.366-.052.218-.173.265-.4.16-1.501-.7-2.439-2.889-2.439-4.65 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const socials = [
  { label: "Instagram", href: "https://instagram.com/keyofhearts.co", Icon: Instagram },
  { label: "TikTok", href: "https://tiktok.com/@keyofhearts.co", Icon: Music2 },
  { label: "YouTube", href: "https://youtube.com/@keyofhearts.co", Icon: Youtube },
  { label: "Pinterest", href: "https://pinterest.com/keyofhearts.co", Icon: PinterestIcon },
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
                {c.links.map((l) =>
                  l.to ? (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-cream/70 hover:text-gold transition-colors text-sm"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-cream/70 hover:text-gold transition-colors text-sm"
                      >
                        {l.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
          <div>
            <p className="label-eyebrow text-gold mb-4">Connect</p>
            <a
              href="mailto:hello@keyofhearts.com"
              className="text-cream/70 hover:text-gold transition-colors text-sm block mb-4"
            >
              hello@keyofhearts.com
            </a>
            <div className="flex gap-3 flex-wrap">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                >
                  <Icon className="size-4" />
                </a>
              ))}
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
