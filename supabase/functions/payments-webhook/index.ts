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

async function forwardToN8n(payload: Record<string, unknown>) {
  const url = Deno.env.get("N8N_FULFILLMENT_WEBHOOK_URL");
  if (!url) {
    console.warn("N8N_FULFILLMENT_WEBHOOK_URL not configured; skipping n8n forward");
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(`n8n webhook failed [${res.status}]: ${text}`);
    } else {
      console.log(`n8n webhook delivered [${res.status}]`);
    }
  } catch (err) {
    console.error("n8n webhook error:", err);
  }
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const lineItem = session?.line_items?.data?.[0];
  const priceId = session?.metadata?.priceId || lineItem?.price?.metadata?.lovable_external_id;
  const productId = lineItem?.price?.product || null;
  const customerEmail = session.customer_email ?? session.customer_details?.email ?? null;
  const status = session.payment_status === "paid" ? "paid" : (session.payment_status ?? "pending");

  await (getSupabase().from("orders") as any).upsert(
    {
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent ?? null,
      stripe_customer_id: session.customer ?? null,
      customer_email: customerEmail,
      price_id: priceId ?? null,
      product_id: productId,
      amount_total: session.amount_total ?? null,
      currency: session.currency ?? "usd",
      status,
      environment: env,
      metadata: session.metadata ?? {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_session_id" },
  );

  // Only fire fulfillment for successful payments
  if (status === "paid") {
    await forwardToN8n({
      event: "order.paid",
      environment: env,
      order: {
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent ?? null,
        stripe_customer_id: session.customer ?? null,
        customer_email: customerEmail,
        customer_details: session.customer_details ?? null,
        shipping_details: session.shipping_details ?? session.collected_information?.shipping_details ?? null,
        price_id: priceId ?? null,
        product_id: productId,
        amount_total: session.amount_total ?? null,
        amount_subtotal: session.amount_subtotal ?? null,
        currency: session.currency ?? "usd",
        status,
        metadata: session.metadata ?? {},
        line_items: session.line_items?.data ?? [],
      },
      occurred_at: new Date().toISOString(),
    });
  }
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
