import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const lineItem = session?.line_items?.data?.[0];
  const priceId = session?.metadata?.priceId || lineItem?.price?.metadata?.lovable_external_id;
  const productId = lineItem?.price?.product || null;

  await getSupabase().from("orders").upsert(
    {
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent ?? null,
      stripe_customer_id: session.customer ?? null,
      customer_email: session.customer_email ?? session.customer_details?.email ?? null,
      price_id: priceId ?? null,
      product_id: productId,
      amount_total: session.amount_total ?? null,
      currency: session.currency ?? "usd",
      status: session.payment_status === "paid" ? "paid" : (session.payment_status ?? "pending"),
      environment: env,
      metadata: session.metadata ?? {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_session_id" },
  );
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      case "checkout.session.async_payment_failed":
        await handleCheckoutCompleted(
          { ...event.data.object, payment_status: "failed" },
          env,
        );
        break;
      default:
        console.log("Unhandled event:", event.type);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
