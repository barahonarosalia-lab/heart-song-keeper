import { useCallback, useState } from "react";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CheckoutOptions {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  metadata?: Record<string, string>;
  returnUrl?: string;
}

export function useStripeCheckout() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<CheckoutOptions | null>(null);

  const openCheckout = useCallback((opts: CheckoutOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  const checkoutElement = (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeCheckout();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-cream">
        <DialogHeader>
          <DialogTitle className="font-serif text-navy text-2xl">Complete your order</DialogTitle>
        </DialogHeader>
        {isOpen && options && <StripeEmbeddedCheckout {...options} />}
        <p className="text-xs text-muted-foreground italic text-center px-2 pt-2">
          By completing your purchase you agree to receive order updates and occasional
          emails from Key of Hearts. Unsubscribe anytime.
        </p>
      </DialogContent>
    </Dialog>
  );

  return { openCheckout, closeCheckout, isOpen, checkoutElement };
}
