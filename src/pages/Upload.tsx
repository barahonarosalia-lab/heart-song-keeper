import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

const UPLOADCARE_PUBLIC_KEY = "b449aa35a5d74a79b1d5";

type OrderMeta = {
  recipient_name?: string;
  occasion?: string;
  product?: string;
  tier?: string;
};

type UploadedFile = {
  uuid: string;
  name: string;
  cdnUrl: string;
};

declare global {
  interface Window {
    uploadcare?: any;
  }
}

const labelize = (val?: string) => {
  if (!val) return "";
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const Upload = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";

  const [meta, setMeta] = useState<OrderMeta | null>(null);
  const [orderLoading, setOrderLoading] = useState(!!orderId);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const widgetRef = useRef<HTMLInputElement>(null);
  const widgetApiRef = useRef<any>(null);

  // Fetch order details
  useEffect(() => {
    if (!orderId) {
      setOrderLoading(false);
      return;
    }
    let cancelled = false;
    const isSession = orderId.startsWith("cs_");
    (async () => {
      const query = supabase
        .from("orders")
        .select("metadata")
        .limit(1);
      const { data, error } = isSession
        ? await query.eq("stripe_session_id", orderId).maybeSingle()
        : await query.eq("id", orderId).maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setOrderError("We couldn't find that order. You can still upload — we'll match it up.");
        setOrderLoading(false);
        return;
      }
      const m = (data.metadata ?? {}) as OrderMeta;
      setMeta(m);
      setOrderLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  // Load Uploadcare script + initialize widget
  useEffect(() => {
    const SRC = "https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js";
    const init = () => {
      if (!window.uploadcare || !widgetRef.current) return;
      const widget = window.uploadcare.Widget(widgetRef.current);
      widgetApiRef.current = widget;
      widget.onUploadComplete(async (info: any) => {
        const file: UploadedFile = {
          uuid: info.uuid,
          name: info.name,
          cdnUrl: info.cdnUrl,
        };
        setUploaded(file);
        setUploadError(null);

        // Tag the file with order_id via Uploadcare REST API metadata
        if (orderId) {
          try {
            await fetch(`https://api.uploadcare.com/files/${info.uuid}/metadata/order_id/`, {
              method: "PUT",
              headers: {
                "Accept": "application/vnd.uploadcare-v0.7+json",
                "Authorization": `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderId),
            });
          } catch {
            // Non-blocking — file is uploaded; tagging is best-effort from client
          }
        }
      });
    };

    if (window.uploadcare) {
      init();
      return;
    }
    const existing = document.querySelector(`script[src="${SRC}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }
    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    script.onload = init;
    script.onerror = () => setUploadError("We couldn't load the uploader. Please refresh and try again.");
    document.body.appendChild(script);
  }, [orderId]);

  const detailRows: Array<[string, string]> = [
    ["Recipient", meta?.recipient_name ?? ""],
    ["Occasion", labelize(meta?.occasion)],
    ["Product", labelize(meta?.product)],
    ["Tier", labelize(meta?.tier)],
  ].filter(([, v]) => !!v) as Array<[string, string]>;

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="pt-32 pb-24">
        <section className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="label-eyebrow text-gold mb-6">Upload your audio</p>
            <h1 className="font-serif text-4xl md:text-5xl text-navy mb-6 leading-tight text-balance">
              Send us the <span className="italic text-rose">moment</span>
            </h1>
            <p className="text-navy/70 text-lg leading-relaxed">
              Upload the recording you'd like preserved. We'll handle the rest with care.
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-card border border-gold/20 p-8 md:p-10 space-y-8">
            {/* Order details */}
            <div className="border-b border-gold/20 pb-6">
              <p className="label-eyebrow text-navy/60 mb-4">Your order</p>
              {orderLoading ? (
                <p className="text-sm text-navy/60">Loading order details…</p>
              ) : orderError ? (
                <p className="text-sm text-rose">{orderError}</p>
              ) : detailRows.length > 0 ? (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {detailRows.map(([label, value]) => (
                    <div key={label} className="flex justify-between sm:flex-col sm:justify-start gap-1">
                      <dt className="text-xs uppercase tracking-wider text-navy/50">{label}</dt>
                      <dd className="font-serif text-navy">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-navy/60 italic">
                  {orderId ? `Order ${orderId}` : "No order ID provided — your upload will still be received."}
                </p>
              )}
            </div>

            {/* Upload widget */}
            {!uploaded && (
              <div className="space-y-4">
                <p className="text-navy/80 text-sm leading-relaxed">
                  Choose an audio file (voice memo, video clip, or recording). We accept the most common formats.
                </p>
                <div className="rounded-xl border border-dashed border-gold/40 bg-cream/50 p-6">
                  <input
                    ref={widgetRef}
                    type="hidden"
                    data-public-key={UPLOADCARE_PUBLIC_KEY}
                    data-tabs="file camera url"
                    data-preview-step="true"
                    data-images-only="false"
                    data-clearable="true"
                  />
                </div>
                {uploadError && (
                  <p className="text-sm text-rose">{uploadError}</p>
                )}
                {orderId && (
                  <p className="text-xs text-navy/50 italic">
                    Linked to order {orderId}
                  </p>
                )}
              </div>
            )}

            {/* Confirmation */}
            {uploaded && (
              <div className="text-center space-y-4 py-4">
                <p className="font-serif text-3xl text-navy leading-tight">
                  We have it. <span className="italic text-rose">Your order is in good hands.</span>
                </p>
                <p className="text-navy/70 text-sm">
                  Received: <span className="font-medium text-navy">{uploaded.name}</span>
                </p>
                {orderId && (
                  <p className="text-xs text-navy/50 italic">
                    Tagged to order {orderId}
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-sm text-navy/60 mt-10">
            Need help?{" "}
            <a href="mailto:hello@keyofhearts.com" className="text-gold hover:underline">
              hello@keyofhearts.com
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;
