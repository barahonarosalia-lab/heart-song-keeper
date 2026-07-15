import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

interface StripeEmbeddedCheckoutProps {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  metadata?: Record<string, string>;
  returnUrl?: string;
  extraPriceIds?: string[];
}

export function StripeEmbeddedCheckout({
  priceId,
  quantity,
  customerEmail,
  metadata,
  returnUrl,
  extraPriceIds,
}: StripeEmbeddedCheckoutProps) {
  const fetchClientSecret = async (): Promise<string> => {
    const finalReturnUrl =
      returnUrl ?? `${window.location.origin}/order/{CHECKOUT_SESSION_ID}`;

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId,
        quantity,
        customerEmail,
        metadata,
        returnUrl: finalReturnUrl,
        environment: getStripeEnvironment(),
        extraPriceIds,
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || "Failed to create checkout session");
    }
    return data.clientSecret as string;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
