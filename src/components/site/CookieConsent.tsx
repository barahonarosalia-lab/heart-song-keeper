import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("koh-cookie-consent");
    if (!accepted) {
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("koh-cookie-consent", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-50 animate-fade-up">
      <div className="bg-navy text-cream rounded-2xl shadow-card border border-cream/10 p-5 md:p-6 backdrop-blur">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="font-serif text-lg mb-2">A small note about cookies</p>
            <p className="text-sm text-cream/70 leading-relaxed">
              We use cookies to make Key of Hearts work beautifully and to understand what you love.
              See our <a href="#" className="text-gold underline-offset-4 hover:underline">privacy policy</a>.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="gold" size="sm" onClick={accept}>Accept</Button>
              <Button variant="cream" size="sm" onClick={accept}>Decline</Button>
            </div>
          </div>
          <button onClick={accept} aria-label="Close" className="text-cream/60 hover:text-cream -mt-1">
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
