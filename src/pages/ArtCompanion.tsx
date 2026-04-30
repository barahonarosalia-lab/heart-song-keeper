import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { ART_COMPANION_PRICE_ID } from "@/lib/pricing";

const ArtCompanion = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";
  const { openCheckout, checkoutElement } = useStripeCheckout();

  const handleBuy = () => {
    openCheckout({
      priceId: ART_COMPANION_PRICE_ID,
      metadata: orderId ? { parent_order_id: orderId, addon: "art_companion_digital" } : undefined,
      returnUrl: `${window.location.origin}/order/{CHECKOUT_SESSION_ID}`,
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="pt-32 pb-24">
        <section className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="label-eyebrow text-gold mb-6">Art Companion</p>
            <h1 className="font-serif text-4xl md:text-5xl text-navy mb-6 leading-tight text-balance">
              The art behind <span className="italic text-rose">their Key</span>
            </h1>
            <p className="text-navy/70 text-lg leading-relaxed">
              A digital companion piece to the jewelry you gave —
              the same artwork they wear, ready to print, frame, or save.
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-card border border-gold/20 p-8 md:p-10 space-y-6">
            <div className="flex items-baseline justify-between border-b border-gold/20 pb-5">
              <div>
                <p className="font-serif text-2xl text-navy">Art Companion — Digital</p>
                <p className="text-sm text-navy/60 mt-1">High-resolution download · Instant delivery</p>
              </div>
              <p className="font-serif text-3xl text-navy">$15</p>
            </div>

            <ul className="space-y-2 text-sm text-navy/80 leading-relaxed">
              <li>· Print at home or any print shop</li>
              <li>· Pairs with the artwork on their jewelry</li>
              <li>· Delivered to your inbox within minutes</li>
            </ul>

            {orderId && (
              <p className="text-xs text-navy/50 italic">
                Linked to order {orderId}
              </p>
            )}

            <Button
              variant="gold"
              size="xl"
              className="w-full font-serif"
              onClick={handleBuy}
            >
              Add Art Companion — $15 →
            </Button>

            <p className="text-center text-xs text-navy/60 italic">
              By completing your purchase you agree to receive order updates and
              occasional emails from Key of Hearts. Unsubscribe anytime.
            </p>
          </div>

          <p className="text-center text-sm text-navy/60 mt-10">
            Questions?{" "}
            <a href="mailto:hello@keyofhearts.com" className="text-gold hover:underline">
              hello@keyofhearts.com
            </a>
          </p>
        </section>
      </main>
      {checkoutElement}
      <Footer />
    </div>
  );
};

export default ArtCompanion;
