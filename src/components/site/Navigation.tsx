import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Collections", href: "#collections" },
  { label: "How it works", href: "#how" },
  { label: "Products", href: "#products" },
  { label: "Gift Cards", href: "#gift-cards" },
];

const overlayLinks = [
  { label: "How it works", to: "/how-it-works" },
  { label: "Collections", to: "/collections" },
  { label: "Pricing", to: "/pricing" },
  { label: "Gift cards", to: "/gift-cards" },
  { label: "Upgrade your Key", to: "/upgrade" },
];

export const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-navy/85 backdrop-blur-md border-b border-cream/10"
            : "bg-transparent"
        )}
      >
        <nav className="container flex items-center justify-between h-20">
          <Link to="/" className="font-serif text-2xl md:text-[28px] text-cream tracking-tight leading-none">
            Key of Hearts
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-cream/80 hover:text-gold transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button variant="gold" asChild>
              <Link to="/start">Find their key</Link>
            </Button>
          </div>

          <button
            className="lg:hidden text-cream p-2 -mr-2 relative z-[60]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </nav>
      </header>

      {/* Full-screen overlay menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-[55] bg-navy transition-all duration-500",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div className="h-full w-full flex flex-col px-8 pt-24 pb-10 overflow-y-auto">
          <nav className="flex-1 flex flex-col justify-center gap-6">
            {overlayLinks.map((l, i) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "group font-serif text-cream text-3xl sm:text-4xl leading-tight w-fit transition-all duration-500",
                  open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
              >
                <span className="relative inline-block pb-1">
                  {l.label}
                  <span className="absolute left-0 bottom-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full group-active:w-full group-focus:w-full" />
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-10 space-y-6">
            <Button variant="gold" size="lg" className="w-full" asChild>
              <Link to="/start" onClick={() => setOpen(false)}>
                Find their Key →
              </Link>
            </Button>

            <div className="text-center">
              <Link
                to="/upgrade"
                onClick={() => setOpen(false)}
                className="text-sm text-cream/50 hover:text-gold transition-colors"
              >
                Already have a Key? Upgrade it →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
