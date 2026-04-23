import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Collections", href: "#collections" },
  { label: "How it works", href: "#how" },
  { label: "Products", href: "#products" },
  { label: "Gift Cards", href: "#gift-cards" },
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

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-navy/85 backdrop-blur-md border-b border-cream/10"
          : "bg-transparent"
      )}
    >
      <nav className="container flex items-center justify-between h-20">
        <a href="#" className="font-serif text-2xl md:text-[28px] text-cream tracking-tight leading-none">
          Key of Hearts
        </a>

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
            <a href="#start">Find their key</a>
          </Button>
        </div>

        <button
          className="lg:hidden text-cream p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-500 bg-navy-deep border-t border-cream/10",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-cream/90 text-base py-1"
            >
              {l.label}
            </a>
          ))}
          <Button variant="gold" className="w-full mt-2" asChild>
            <a href="#start" onClick={() => setOpen(false)}>Find their key</a>
          </Button>
        </div>
      </div>
    </header>
  );
};
