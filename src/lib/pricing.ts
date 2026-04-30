// Maps an order's product/tier (and finish for jewelry) to a Stripe price ID.
// Price IDs are created in Stripe via batch_create_product and are stable
// across sandbox and live.

import type { ProductId, Tier, JewelryFinish } from "./orderTypes";

export function priceIdForOrder(args: {
  product: ProductId;
  tier: Tier;
  jewelryFinish?: JewelryFinish | null;
}): string | null {
  const { product, tier, jewelryFinish } = args;
  switch (product) {
    case "digital":
      return tier === "signature" ? "digital_signature" : "digital_preserve";
    case "canvas":
      return tier === "signature" ? "canvas_signature" : "canvas_preserve";
    case "ornament":
      return tier === "signature" ? "ornament_signature" : "ornament_preserve";
    case "blanket":
      return tier === "signature" ? "blanket_signature" : "blanket_preserve";
    case "photo_blanket":
      return tier === "signature" ? "photo_blanket_signature" : "photo_blanket_preserve";
    case "jewelry": {
      const finish: JewelryFinish = jewelryFinish ?? "silver";
      if (finish === "gold") {
        return tier === "signature" ? "jewelry_gold_signature" : "jewelry_gold_preserve";
      }
      return tier === "signature" ? "jewelry_silver_signature" : "jewelry_silver_preserve";
    }
    default:
      return null;
  }
}

export function giftCardPriceId(amount: number): string | null {
  if (![29, 49, 59, 89, 119].includes(amount)) return null;
  return `gift_card_${amount}`;
}

export const UPGRADE_PRICE_ID = "upgrade_key";

// Optional add-on: digital copy bundled with a physical product (canvas/blanket).
// $10 one-time. Surfaced as a checkbox on the Order review step.
export const DIGITAL_ADDON_PRICE_ID = "digital_addon";

// Standalone post-purchase upsell linked from the jewelry confirmation email.
// $15 one-time. Sold via the /art-companion page only.
export const ART_COMPANION_PRICE_ID = "art_companion_digital";
