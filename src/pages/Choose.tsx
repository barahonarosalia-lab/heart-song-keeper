import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Manifest {
  song_a_url?: string;
  song_b_url?: string;
  recipient_name?: string;
  qr_state?: string;
  is_vinyl_poster?: boolean;
}

const N8N_CHOICE = "https://koh-choice-proxy.barahonarosalia.workers.dev";
const N8N_REGEN = "https://koh-choice-proxy.barahonarosalia.workers.dev/regenerate";

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-gold" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.3C.3 8.2 2.2 4 6.2 4c2.2 0 3.8 1.2 4.8 2.7C12 5.2 13.6 4 15.8 4c4 0 5.9 4.2 4.2 7.7C19.5 16.4 12 21 12 21z" />
  </svg>
);

const Choose = () => {
  const [params] = useSearchParams();
  const order = params.get("order") || "";
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chosen, setChosen] = useState<"A" | "B" | null>(null);
  const [regenerated, setRegenerated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");

  useEffect(() => {
    if (!order) {
      setLoading(false);
      setError(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const token = params.get("token") || "";
        const res = await fetch(`https://koh-listen.barahonarosalia.workers.dev/${order}?token=${token}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(String(res.status));
        const data: Manifest = await res.json();
        if (!cancelled) setManifest(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [order]);

  const choose = async (choice: "A" | "B") => {
    if (submitting) return;
    if (manifest?.is_vinyl_poster && (!songTitle.trim() || !songArtist.trim())) return;
    setSubmitting(true);
    try {
      await fetch(N8N_CHOICE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order,
          choice,
          ...(manifest?.is_vinyl_poster && {
            song_title: songTitle.trim(),
            song_artist: songArtist.trim(),
          }),
        }),
      });
    } catch {}
    setChosen(choice);
    setSubmitting(false);
  };

  const regenerate = () => {
    fetch(N8N_REGEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order }),
    }).catch(() => {});
    setRegenerated(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-navy flex items-center justify-center px-6">
        <p className="font-serif italic text-gold text-base">Loading…</p>
      </main>
    );
  }

  if (manifest?.qr_state === "activated") {
    return (
      <main className="min-h-screen w-full bg-navy flex items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center gap-4 max-w-md">
          <p className="font-serif text-cream text-2xl md:text-3xl">This song has already been chosen.</p>
          <a href={`/listen/${order}`} className="font-serif italic text-gold text-base underline-offset-4 hover:underline">
            Listen now →
          </a>
        </div>
      </main>
    );
  }

  if (error || !manifest?.song_a_url || !manifest?.song_b_url) {
    return (
      <main className="min-h-screen w-full bg-navy flex items-center justify-center px-6 text-center">
        <p className="font-serif text-cream text-lg max-w-md">
          Something went wrong — email us at{" "}
          <a href="mailto:hello@keyofhearts.com" className="text-gold underline-offset-4 hover:underline">
            hello@keyofhearts.com
          </a>
        </p>
      </main>
    );
  }

  if (regenerated) {
    return (
      <main className="min-h-screen w-full bg-navy flex items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center gap-6 max-w-md">
          <HeartIcon />
          <h1 className="font-serif text-cream text-5xl md:text-6xl">We're starting over.</h1>
          <p className="text-cream/80 text-base md:text-lg font-light leading-relaxed">
            We want this to feel exactly like them. We're writing something new — you'll receive a fresh set of songs to choose from shortly.
          </p>
        </div>
      </main>
    );
  }

  if (chosen) {
    return (
      <main className="min-h-screen w-full bg-navy flex items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center gap-6 max-w-md">
          <HeartIcon />
          <h1 className="font-serif text-cream text-5xl md:text-6xl">Perfect.</h1>
          <p className="text-cream/80 text-base md:text-lg font-light leading-relaxed">
            We're putting the finishing touches on their gift. You'll receive a link to share when the moment is right.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-navy text-cream px-6 py-16">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-12">
        <div className="flex flex-col items-center gap-3">
          <p className="label-eyebrow text-gold">Story Song</p>
          <h1 className="font-serif text-cream text-3xl md:text-4xl">
            Two versions. Choose the one that feels like them.
          </h1>
          {manifest.recipient_name && (
            <p className="text-cream/70 text-sm font-light tracking-wide">For {manifest.recipient_name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {(["A", "B"] as const).map((v) => {
            const url = v === "A" ? manifest.song_a_url! : manifest.song_b_url!;
            return (
              <div
                key={v}
                className="flex flex-col items-center gap-5 p-8 rounded-2xl border border-gold/30 bg-navy-deep/40"
              >
                <h2 className="font-serif text-cream text-2xl">Version {v}</h2>
                <audio controls src={url} preload="metadata" className="w-full" />
                <button
                  type="button"
                  onClick={() => choose(v)}
                  disabled={submitting}
                  className="mt-2 px-8 py-3 rounded-full bg-gradient-gold text-navy font-semibold shadow-[0_8px_24px_-8px_hsl(var(--gold)/0.6)] hover:shadow-[0_12px_32px_-8px_hsl(var(--gold)/0.8)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving…" : `This one — Version ${v}`}
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={regenerate}
          className="font-serif italic text-gold text-sm underline-offset-4 hover:underline"
        >
          Neither feels right — write them a new one
        </button>
      </div>
    </main>
  );
};

export default Choose;
