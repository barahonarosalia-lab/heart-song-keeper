import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listMyOrdersTool from "./tools/list-my-orders";
import getMyOrderTool from "./tools/get-my-order";

// Issuer must be the direct Supabase host, not the .lovable.cloud proxy.
// Read the project ref from the Vite-inlined env; the sentinel fallback keeps
// this entry import-safe during the build-time manifest extract.
const projectRef =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "key-of-hearts-mcp",
  title: "Key of Hearts",
  version: "0.1.0",
  instructions:
    "Tools for Key of Hearts customers. Use `list_my_orders` to see the signed-in customer's orders and `get_my_order` to fetch a specific order by id.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listMyOrdersTool, getMyOrderTool],
});
