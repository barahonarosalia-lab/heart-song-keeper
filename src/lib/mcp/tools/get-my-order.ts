import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_my_order",
  title: "Get one of my orders",
  description:
    "Fetch a single Key of Hearts order (by Stripe session id or order id) belonging to the signed-in user.",
  inputSchema: {
    order_id: z
      .string()
      .min(1)
      .describe("The order id or Stripe checkout session id."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const email = ctx.getUserEmail();
    if (!email) {
      return {
        content: [{ type: "text", text: "No email on account; cannot look up order." }],
        isError: true,
      };
    }
    const client = supabaseForUser(ctx);
    const { data, error } = await client
      .from("orders")
      .select("*")
      .eq("customer_email", email)
      .or(`id.eq.${order_id},stripe_session_id.eq.${order_id}`)
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return {
        content: [{ type: "text", text: "Order not found for this account." }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { order: data },
    };
  },
});
