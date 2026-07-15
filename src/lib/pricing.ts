// Maps an order's product/tier (and finish for jewelry) to a Stripe price ID.
// Price IDs are generated programmatically from the base table below to keep
// this DRY. Story is the base tier; Voice adds a flat $20; Memory adds $30.

import type { ProductId, Tier, JewelryFinish } from "./orderTypes";

type PriceKey =
  | "digital"
  | "canvas"
  | "ornament"
  | "jewelry_silver"
  | "jewelry_gold"
  | "blanket";

// Story-tier base prices (USD). Voice = +$20, Memory = +$30 on every product.
export const BASE_STORY_PRICES: Record<PriceKey, number> = {
  digital: 49,
  canvas: 99,
  ornament: 79,
  jewelry_silver: 109,
  jewelry_gold: 119,
  blanket: 139,
};

export const TIER_UPCHARGE: Record<Tier, number> = {
  story: 0,
  voice: 20,
  memory: 30,
};

export function amountForPriceKey(key: PriceKey, tier: Tier): number {
  return BASE_STORY_PRICES[key] + TIER_UPCHARGE[tier];
}

// e.g. "digital_story", "jewelry_gold_memory"
export function priceIdFor(key: PriceKey, tier: Tier): string {
  return `${key}_${tier}`;
}

function priceKeyForOrder(
  product: ProductId,
  jewelryFinish?: JewelryFinish | null,
): PriceKey | null {
  switch (product) {
    case "digital":
    case "canvas":
    case "ornament":
    case "blanket":
      return product;
    case "jewelry":
      return (jewelryFinish ?? "silver") === "gold" ? "jewelry_gold" : "jewelry_silver";
    default:
      return null;
  }
}

export function priceIdForOrder(args: {
  product: ProductId;
  tier: Tier;
  jewelryFinish?: JewelryFinish | null;
}): string | null {
  const key = priceKeyForOrder(args.product, args.jewelryFinish);
  return key ? priceIdFor(key, args.tier) : null;
}

export function giftCardPriceId(amount: number): string | null {
  if (![29, 49, 59, 89, 119].includes(amount)) return null;
  return `gift_card_${amount}`;
}

export const UPGRADE_PRICE_ID = "upgrade_key";

// Optional add-on: visual/digital copy bundled with a physical product.
// Flat $10 across all tiers.
export const DIGITAL_ADDON_PRICE_ID = "digital_addon";

// Standalone post-purchase upsell linked from the jewelry confirmation email.
// $15 one-time. Sold via the /art-companion page only.
export const ART_COMPANION_PRICE_ID = "art_companion_digital";

// Vinyl Poster photo upsell — $10 one-time. Added as an extra Stripe
// line item alongside the base Digital/Canvas Story SKU when the customer
// chooses "Your Photo" as the center of their vinyl poster. Vinyl Poster
// itself is a style flag on those SKUs, not a separate product.
export const VINYL_PHOTO_UPSELL_PRICE_ID = "vinyl_photo_upsell";
