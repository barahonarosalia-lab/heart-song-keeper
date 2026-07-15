import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

interface CheckoutBody {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  returnUrl: string;
  environment: StripeEnv;
  metadata?: Record<string, string>;
  // Additional price lookup keys to bundle as extra line items (qty 1
  // each) alongside the primary priceId.
  extraPriceIds?: string[];
}

// Broad international shipping list — Stripe's supported shipping
// countries with sanctioned/embargoed jurisdictions removed. Typed as
// the Stripe SDK's AllowedCountry union via `as const`.
const SHIPPING_ALLOWED_COUNTRIES = [
  "AC","AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AT","AU","AW","AX","AZ",
  "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BZ",
  "CA","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CV","CW","CY","CZ",
  "DE","DJ","DK","DM","DO","DZ",
  "EC","EE","EG","EH","ER","ES","ET",
  "FI","FJ","FK","FO","FR",
  "GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY",
  "HK","HN","HR","HT","HU",
  "ID","IE","IL","IM","IN","IO","IQ","IS","IT",
  "JE","JM","JO","JP",
  "KE","KG","KH","KI","KM","KN","KR","KW","KY","KZ",
  "LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY",
  "MA","MC","MD","ME","MF","MG","MK","ML","MM","MN","MO","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ",
  "NA","NC","NE","NG","NI","NL","NO","NP","NR","NU","NZ",
  "OM",
  "PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PY",
  "QA",
  "RE","RO","RS","RU","RW",
  "SA","SB","SC","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SZ",
  "TA","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ",
  "UA","UG","US","UY","UZ",
  "VA","VC","VE","VG","VN","VU",
  "WF","WS",
  "XK",
  "YE","YT",
  "ZA","ZM","ZW",
  "ZZ",
] as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as CheckoutBody;
    const { priceId, quantity, customerEmail, returnUrl, environment, metadata } = body;

    if (!priceId || !/^[a-zA-Z0-9_-]+$/.test(priceId)) {
      throw new Error("Invalid priceId");
    }
    if (!returnUrl) throw new Error("Missing returnUrl");
    if (environment !== "sandbox" && environment !== "live") {
      throw new Error("Invalid environment");
    }

    const stripe = createStripeClient(environment);

    const prices = await stripe.prices.list({ lookup_keys: [priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: quantity || 1 }],
      mode: "payment",
      ui_mode: "embedded",
      return_url: returnUrl,
      ...(customerEmail && { customer_email: customerEmail }),
      // Stripe requires an explicit allowed_countries list for
      // shipping_address_collection — there is no "any country" option.
      // This is a broad international list (Stripe's supported shipping
      // countries, minus sanctioned/embargoed jurisdictions). Applied to
      // every session; harmless no-op for digital-only orders.
      shipping_address_collection: {
        allowed_countries: SHIPPING_ALLOWED_COUNTRIES,
      },
      metadata: {
        priceId,
        ...(metadata || {}),
      },
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-checkout error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
