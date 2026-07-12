import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

// ----- Types -----
type Tier = "story" | "voice" | "memory";

interface ListenRecord {
  order_id: string;
  tier: Tier;
  occasion: string;
  recipient_name: string;
  collection: string;
  art_name: string;
  card_message: string;
  dedication: string;
  song_title: string;
  audio_url: string;
  video_url?: string;
  content_type?: string;
  duration_seconds: number;
  preserve_status: "approved" | "pending";
  paid: boolean;
  qr_state?: string;
}

interface Manifest {
  order_id: string;
  recipient_name: string;
  occasion: string;
  song_title: string;
  audio_url: string;
  video_url?: string;
  content_type?: string;
  card_message: string;
  dedication?: string;
  is_story?: boolean;
  is_voice?: boolean;
  is_memory?: boolean;
  lyrics?: string;
  lyrics_synced?: unknown;
  gifter_name?: string;
  qr_state?: string;
  display_title?: string;
}

const mapManifest = (m: Manifest): ListenRecord => {
  const tier: Tier = m.is_memory ? "memory" : m.is_voice ? "voice" : "story";
  const title =
    m.qr_state === "activated" && m.display_title
      ? m.display_title
      : m.song_title ?? "";
  return {
    order_id: m.order_id,
    tier,
    occasion: m.occasion ?? "",
    recipient_name: m.recipient_name ?? "",
    collection: "",
    art_name: "",
    card_message: m.card_message ?? "",
    dedication: m.dedication ?? "",
    song_title: title,
    audio_url: m.audio_url ?? "",
    video_url: m.video_url,
    content_type: m.content_type,
    duration_seconds: 0,
    preserve_status: "approved",
    paid: true,
    qr_state: m.qr_state,
  };
};

const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// ===== Not Found state =====
const NotFound = () => (
  <main className="min-h-screen w-full bg-navy flex flex-col items-center justify-center px-6 text-center">
    <h1 className="font-serif text-cream text-3xl md:text-4xl mb-6">
      We couldn't find this Key.
    </h1>
    <p className="text-gold text-sm font-serif italic">
      Need help?{" "}
      <a href="mailto:hello@keyofhearts.com" className="underline-offset-4 hover:underline">
        hello@keyofhearts.com
      </a>
    </p>
  </main>
);

// ===== Play button =====
const PlayCircle = ({
  isPlaying,
  onClick,
}: {
  isPlaying: boolean;
  onClick: () => void;
}) => (
  <div className="relative inline-flex items-center justify-center">
    {/* Heartbeat pulse ring — only while playing */}
    {isPlaying && (
      <>
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 animate-[heartbeat_2s_ease-out_infinite] pointer-events-none"
          style={{ borderColor: "rgba(201, 168, 76, 0.3)" }}
        />
        <style>{`
          @keyframes heartbeat {
            0%   { transform: scale(1);   opacity: 0.6; }
            70%  { transform: scale(1.6); opacity: 0;   }
            100% { transform: scale(1.6); opacity: 0;   }
          }
        `}</style>
      </>
    )}
    <button
      type="button"
      onClick={onClick}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="group relative h-20 w-20 rounded-full bg-navy border-2 border-gold flex items-center justify-center shadow-[0_0_40px_hsl(var(--gold)/0.35)] transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
    >
      {isPlaying ? (
        <Pause className="h-8 w-8 text-cream" fill="currentColor" />
      ) : (
        <Play className="h-8 w-8 text-cream ml-1" fill="currentColor" />
      )}
    </button>
  </div>
);

// ===== Progress bar =====
const ProgressBar = ({
  current,
  duration,
  onSeek,
}: {
  current: number;
  duration: number;
  onSeek: (s: number) => void;
}) => {
  const pct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="flex items-center gap-3">
        <span className="text-cream/70 text-xs tabular-nums w-10 text-right">
          {formatTime(current)}
        </span>
        <button
          type="button"
          aria-label="Seek"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            onSeek(Math.max(0, Math.min(1, ratio)) * duration);
          }}
          className="relative flex-1 h-[2px] bg-cream/20 overflow-hidden cursor-pointer"
        >
          <div
            className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-200 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </button>
        <span className="text-cream/70 text-xs tabular-nums w-10">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

const Listen = () => {
  const { orderId = "" } = useParams<{ orderId: string }>();
  const [record, setRecord] = useState<ListenRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [needsTap, setNeedsTap] = useState(false);

  // Fetch manifest from Cloudflare Worker
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const token = new URLSearchParams(window.location.search).get("token");
        const fetchUrl = `https://koh-listen.barahonarosalia.workers.dev/${orderId}${token ? "?token=" + token : ""}`;
        const res = await fetch(fetchUrl, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(String(res.status));
        const data: Manifest = await res.json();
        if (cancelled) return;
        setRecord(mapManifest(data));
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  // Log scan once per page load
  useEffect(() => {
    if (!record || !record.paid) return;
    // eslint-disable-next-line no-console
    console.log("[scan_log]", {
      order_id: record.order_id,
      timestamp: new Date().toISOString(),
      device_type: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop",
    });
  }, [record]);

  // Attempt autoplay on mount (audio only — video uses native controls)
  useEffect(() => {
    if (!record || !record.paid) return;
    if (record.content_type === "video" && record.video_url) return;
    const a = audioRef.current;
    if (!a) return;
    const tryPlay = async () => {
      try {
        await a.play();
        setIsPlaying(true);
        setNeedsTap(false);
      } catch {
        setNeedsTap(true);
      }
    };
    tryPlay();
  }, [record]);

  // ----- Loading / Invalid / unpaid -----
  if (loading) {
    return (
      <main className="min-h-screen w-full bg-navy flex items-center justify-center px-6">
        <p className="font-serif italic text-gold text-base">Loading…</p>
      </main>
    );
  }
  if (error || !record || !record.paid) return <NotFound />;

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setIsPlaying(true);
        setNeedsTap(false);
      } catch {
        setNeedsTap(true);
      }
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (s: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = s;
    setCurrentTime(s);
  };

  const isPreserveTier = record.tier === "voice" || record.tier === "memory";
  const isPreservePending = isPreserveTier && record.preserve_status === "pending";
  const isPreserveApproved = isPreserveTier && record.preserve_status === "approved";
  const isVideo = record.content_type === "video" && !!record.video_url;
  const downloadUrl = isVideo ? record.video_url! : record.audio_url;
  const downloadExt = isVideo ? "mp4" : "mp3";

  return (
    <main className="relative min-h-screen w-full bg-navy overflow-hidden text-cream">
      {/* Atmospheric collection art background — 15% opacity */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 pointer-events-none",
          isPlaying && "animate-[breathe_6s_ease-in-out_infinite]",
        )}
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 40%, hsl(var(--gold) / 0.18), transparent 60%), radial-gradient(ellipse at 20% 80%, hsl(var(--rose) / 0.12), transparent 55%), radial-gradient(ellipse at 85% 20%, hsl(var(--cream) / 0.08), transparent 55%)",
          opacity: 0.15,
        }}
      />
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.22; transform: scale(1.02); }
        }
      `}</style>

      {/* Hidden audio element — audio mode only */}
      {!isVideo && (
        <audio
          ref={audioRef}
          src={record.audio_url || undefined}
          preload="metadata"
          onLoadedMetadata={(e) => {
            const d = (e.currentTarget as HTMLAudioElement).duration;
            if (isFinite(d) && d > 0) setDuration(d);
          }}
          onTimeUpdate={(e) => setCurrentTime((e.currentTarget as HTMLAudioElement).currentTime)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Branding only for Preserve Pending */}
      {isPreservePending && (
        <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
          <p className="label-eyebrow text-gold">Key of Hearts</p>
        </div>
      )}

      {/* Centered content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className={cn("w-full flex flex-col items-center text-center gap-6", isVideo ? "max-w-2xl" : "max-w-md")}>
          {/* Recipient */}
          {(record.recipient_name || record.occasion) && (
            <div className="flex flex-col items-center gap-2">
              {record.recipient_name && (
                <p
                  className="font-serif text-gold"
                  style={{ fontSize: "20px", letterSpacing: "2px" }}
                >
                  For {record.recipient_name}
                </p>
              )}
              {record.occasion && (
                <p className="text-cream/60 text-sm font-light tracking-wide">{record.occasion}</p>
              )}
            </div>
          )}

          {/* Player — video or audio */}
          {isVideo ? (
            <div className="my-2 w-full">
              <div className="relative w-full rounded-2xl overflow-hidden border border-gold/40 shadow-[0_0_60px_hsl(var(--gold)/0.25)] bg-navy-deep">
                <video
                  src={record.video_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-auto block bg-black"
                />
              </div>
              {record.dedication && record.dedication.trim() && (
                <p
                  className="mt-4 font-serif italic text-gold text-center"
                  style={{ fontSize: "15px" }}
                >
                  {record.dedication}
                </p>
              )}
            </div>
          ) : (
            <div className="my-2">
              <PlayCircle isPlaying={isPlaying} onClick={togglePlay} />
              {needsTap && (
                <p className="mt-4 font-serif italic text-gold text-sm animate-fade-in">
                  Tap to hear their song
                </p>
              )}
              {record.dedication && record.dedication.trim() && (
                <p
                  className="mt-4 font-serif italic text-gold"
                  style={{ fontSize: "15px" }}
                >
                  {record.dedication}
                </p>
              )}
            </div>
          )}

          {/* State-specific middle content */}
          {record.tier === "story" && (
            <h1 className="font-serif text-cream text-2xl md:text-3xl">{record.song_title}</h1>
          )}

          {isPreserveApproved && (
            <p className="font-serif italic text-gold text-base">
              Their voice. Their words. Forever.
            </p>
          )}

          {isPreservePending && (
            <div className="flex flex-col items-center gap-4">
              <p className="font-serif italic text-cream text-xl md:text-2xl">
                Something beautiful is coming.
              </p>
              <p className="text-cream/70 text-sm leading-relaxed font-light max-w-xs">
                This is a gift being made just for you.
                <br />
                Your song is being prepared with care.
                <br />
                Come back soon — it will be here.
              </p>
            </div>
          )}

          {/* Progress bar — audio only */}
          {!isVideo && (
            <ProgressBar current={currentTime} duration={duration} onSeek={handleSeek} />
          )}

          {/* Download (activated only) */}
          {record.qr_state === "activated" && downloadUrl && (
            <button
              type="button"
              onClick={() => {
                const name = (record.recipient_name || "their").trim().replace(/\s+/g, "-");
                const filename = `${name}-song.${downloadExt}`;
                try {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = filename;
                  a.rel = "noopener";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                } catch {
                  // Fallback if anchor click fails — opens in new tab so it at least plays.
                  // NOTE: For true cross-origin download, R2 CDN must return
                  // `Access-Control-Allow-Origin: *` (infrastructure fix).
                  window.open(downloadUrl, "_blank");
                }
              }}
              className="font-serif italic text-gold/70 text-xs tracking-wide underline-offset-4 hover:text-gold hover:underline transition-colors"
            >
              Download their song.
            </button>
          )}

          {/* Divider for Preserve Pending */}
          {isPreservePending && <div className="w-16 h-px bg-gold/40 my-2" />}

          {/* Card message */}
          <blockquote className="font-serif italic text-cream text-lg md:text-xl leading-relaxed max-w-sm line-clamp-3">
            "{record.card_message}"
          </blockquote>
        </div>

        {/* Bottom whisper */}
        <p className="absolute bottom-8 left-0 right-0 text-center font-serif italic text-gold text-sm">
          Press play. They're waiting.
        </p>
      </div>
    </main>
  );
};

export default Listen;
