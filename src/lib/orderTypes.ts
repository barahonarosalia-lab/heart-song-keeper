// Shared types used by both the Start flow and pricing helpers.
export type Tier = "story" | "voice" | "memory";
export type ProductId =
  | "digital"
  | "canvas"
  | "ornament"
  | "jewelry"
  | "blanket";
export type JewelryFinish = "silver" | "gold";
export type JewelryStyle = "heart" | "round" | "dogtag";
export type PhotoOrArt = "photo" | "art";

// Capitalized tier label sent in checkout payload / Stripe metadata — backend
// does exact-match string lookup on this, so keep the capitalization exact.
export const tierPayloadLabel = (tier: Tier): "Story" | "Voice" | "Memory" => {
  if (tier === "story") return "Story";
  if (tier === "voice") return "Voice";
  return "Memory";
};
