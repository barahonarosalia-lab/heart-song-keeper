// TikTok Events API helper
// Fires the browser pixel AND posts a mirrored event to your automation
// webhook (n8n, Zapier, etc.) which then forwards to TikTok's Events API
// server-side using your access token.
//
// 👉 INSERT YOUR WEBHOOK URL HERE:
export const TIKTOK_EVENTS_WEBHOOK_URL = "";

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void;
      identify?: (params: Record<string, unknown>) => void;
    };
  }
}

export interface TikTokUserData {
  email?: string;        // plain — will be hashed
  phone?: string;        // plain — will be hashed (E.164 recommended)
  external_id?: string;  // e.g. order_id or user id
}

export interface TikTokEventInput {
  eventName: string;                    // e.g. "CompletePayment", "SubmitForm", "Lead"
  eventId?: string;                     // for dedupe between pixel + server. auto-generated if omitted
  url?: string;                         // defaults to current URL
  value?: number;
  currency?: string;
  contents?: Array<{
    content_id?: string;
    content_name?: string;
    content_type?: string;
    quantity?: number;
    price?: number;
  }>;
  user?: TikTokUserData;
  custom?: Record<string, unknown>;     // any extra properties
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Track a TikTok event:
 *  - fires window.ttq.track(...) immediately (browser pixel)
 *  - POSTs a mirrored payload to your webhook for the Events API
 * Uses the same event_id on both sides for dedupe.
 */
export async function trackTikTokEvent(input: TikTokEventInput): Promise<void> {
  const event_id = input.eventId ?? uuid();
  const event_url = input.url ?? (typeof window !== "undefined" ? window.location.href : "");

  // 1) Browser pixel
  if (typeof window !== "undefined" && window.ttq?.track) {
    const pixelParams: Record<string, unknown> = {
      ...(input.value !== undefined && { value: input.value }),
      ...(input.currency && { currency: input.currency }),
      ...(input.contents && { contents: input.contents }),
      ...(input.custom ?? {}),
    };
    try {
      window.ttq.track(input.eventName, pixelParams, { event_id });
    } catch (e) {
      console.warn("[tiktok] pixel track failed", e);
    }
  }

  // 2) Server-side mirror via webhook
  if (!TIKTOK_EVENTS_WEBHOOK_URL) {
    console.info("[tiktok] webhook URL not set — skipping server event", { event_id });
    return;
  }

  const [email_sha256, phone_sha256, external_id_sha256] = await Promise.all([
    input.user?.email ? sha256Hex(input.user.email) : Promise.resolve(undefined),
    input.user?.phone ? sha256Hex(input.user.phone) : Promise.resolve(undefined),
    input.user?.external_id ? sha256Hex(input.user.external_id) : Promise.resolve(undefined),
  ]);

  const payload = {
    event: input.eventName,
    event_id,
    event_time: Math.floor(Date.now() / 1000),
    url: event_url,
    referrer: typeof document !== "undefined" ? document.referrer : "",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    user: {
      email_sha256,
      phone_sha256,
      external_id_sha256,
    },
    properties: {
      ...(input.value !== undefined && { value: input.value }),
      ...(input.currency && { currency: input.currency }),
      ...(input.contents && { contents: input.contents }),
      ...(input.custom ?? {}),
    },
  };

  try {
    await fetch(TIKTOK_EVENTS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (e) {
    console.warn("[tiktok] webhook post failed", e);
  }
}
