import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Play, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// ----- Types --------------------------------------------------------------

type Tier = "signature" | "preserve";
type SongVersion = "instrumental" | "humming" | "with_lyrics";

interface OrderState {
  tier: Tier | null;
  occasion: string | null;
  song_version: SongVersion | null;
  whose_audio: string;
  music_style: string | null;
  audio_url: string;
  send_link_later: boolean;
  audio_consent: boolean;
  audio_consent_at: string | null;
}

const SONG_VERSIONS: { value: SongVersion; label: string; title: string }[] = [
  { value: "instrumental", label: "INSTRUMENTAL", title: "Song 1" },
  { value: "humming", label: "HUMMING", title: "Song 2" },
  { value: "with_lyrics", label: "WITH LYRICS", title: "Song 3" },
];

const OCCASIONS = [
  "Memorial & Remembrance",
  "Pregnancy & Infant Loss",
  "Pet Memorial",
  "Wedding & Anniversary",
  "Birth & Baby",
  "Birthday",
  "Mother's Day",
  "Father's Day",
  "Military & Deployment",
  "Graduation",
  "Sobriety & Milestone",
  "Friendship",
  "Just Because",
  "Childhood Memory",
  "Holiday & Christmas",
];

const MUSIC_STYLES = [
  "Soft Piano",
  "Gentle Strings",
  "Acoustic Guitar",
  "Ambient Warmth",
  "Lullaby",
  "Soft Choir",
  "Celtic & Folk",
  "No Background Music",
];

// ----- Page ---------------------------------------------------------------

const Start = () => {
  const [order, setOrder] = useState<OrderState>({
    tier: null,
    occasion: null,
    song_version: null,
    whose_audio: "",
    music_style: null,
    audio_url: "",
    send_link_later: false,
    audio_consent: false,
    audio_consent_at: null,
  });

  const step2Ref = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleSelectTier = (tier: Tier) => {
    setOrder((prev) => ({ ...prev, tier }));
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const handleSelectOccasion = (occasion: string) => {
    setOrder((prev) => ({ ...prev, occasion, song_version: null }));
  };

  const handleChangeOccasion = () => {
    setOrder((prev) => ({ ...prev, occasion: null, song_version: null }));
  };

  // Reveal details once an occasion is picked
  useEffect(() => {
    if (order.occasion && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, [order.occasion]);

  const handleConsentChange = (checked: boolean) => {
    setOrder((prev) => ({
      ...prev,
      audio_consent: checked,
      audio_consent_at: checked ? new Date().toISOString() : null,
    }));
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    // Placeholder local URL — wired to real upload later
    const url = URL.createObjectURL(file);
    setOrder((prev) => ({ ...prev, audio_url: url }));
  };

  return (
    <main className="min-h-screen bg-cream text-navy">
      {/* HEADER */}
      <header className="bg-gradient-navy text-cream relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-40" />
        <div className="container relative z-10 py-10 md:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-cream/70 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>

          <div className="max-w-3xl space-y-4">
            <p className="label-eyebrow text-gold">Find Their Key</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-balance leading-[1.05]">
              Let's find the <span className="italic text-gold">perfect key.</span>
            </h1>
            <p className="text-cream/70 text-lg">A few choices. Then we do the rest.</p>
          </div>
        </div>
      </header>

      {/* STEP 1 */}
      <Step
        index="01"
        title="How would you like to gift them?"
        subtitle="This choice shapes everything — your song, your product, your price."
      >
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl">
          <TierCard
            label="SIGNATURE"
            heading="We compose their song"
            subtext="We've created original songs for every occasion. Preview three and pick the one that feels like them."
            examples="· Instrumental · Humming · With Lyrics"
            price="From $29"
            cta="Choose Signature"
            selected={order.tier === "signature"}
            onSelect={() => handleSelectTier("signature")}
          />
          <TierCard
            label="PRESERVE"
            heading="We preserve their voice"
            subtext="Upload any recording — a voicemail, vows, a bedtime story. We wrap it in an original score composed just for them."
            examples="· Voicemail · Vows · Bedtime stories · Deployment recordings"
            price="From $49"
            cta="Choose Preserve"
            selected={order.tier === "preserve"}
            onSelect={() => handleSelectTier("preserve")}
          />
        </div>
      </Step>

      {/* STEP 2 — Preserve path */}
      <div ref={step2Ref}>
        {order.tier === "preserve" && (
          <Step
            index="02"
            title="What moment are you celebrating?"
            subtitle="Every voice deserves the right setting."
          >
            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl">
              {OCCASIONS.map((occ) => (
                <OccasionCard
                  key={occ}
                  label={occ}
                  selected={order.occasion === occ}
                  onSelect={() => handleSelectOccasion(occ)}
                />
              ))}
            </div>

            {/* Reveal once an occasion is selected */}
            {order.occasion && (
              <div
                ref={detailsRef}
                className="max-w-3xl mt-12 md:mt-16 space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                {/* Whose voice */}
                <div className="space-y-3">
                  <label
                    htmlFor="whose-audio"
                    className="label-eyebrow text-gold block"
                  >
                    Whose voice or audio is this?
                  </label>
                  <Input
                    id="whose-audio"
                    value={order.whose_audio}
                    onChange={(e) =>
                      setOrder((prev) => ({ ...prev, whose_audio: e.target.value }))
                    }
                    placeholder="e.g. My grandmother Ruth, our dog Cooper"
                    className="h-12 rounded-xl bg-card border-border/60 text-base"
                  />
                </div>

                {/* Music style */}
                <div className="space-y-4">
                  <p className="label-eyebrow text-gold">Background music style</p>
                  <div className="flex flex-wrap gap-2.5">
                    {MUSIC_STYLES.map((style) => {
                      const selected = order.music_style === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() =>
                            setOrder((prev) => ({ ...prev, music_style: style }))
                          }
                          className={cn(
                            "rounded-full px-4 h-10 text-sm font-medium border transition-all",
                            selected
                              ? "bg-gold text-navy border-gold shadow-gold"
                              : "bg-card text-navy border-border/60 hover:border-gold hover:text-navy",
                          )}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Audio upload */}
                <div className="space-y-4">
                  <p className="label-eyebrow text-gold">Upload their audio</p>
                  <label
                    htmlFor="audio-file"
                    className={cn(
                      "block rounded-2xl border-2 border-dashed p-8 md:p-10 text-center cursor-pointer transition-all bg-card/50",
                      order.audio_url
                        ? "border-gold bg-gold/5"
                        : "border-border hover:border-gold hover:bg-gold/5",
                      order.send_link_later && "opacity-60",
                    )}
                  >
                    <input
                      id="audio-file"
                      type="file"
                      accept="audio/mpeg,audio/wav,audio/x-m4a,audio/mp4,.mp3,.wav,.m4a"
                      className="sr-only"
                      onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                    />
                    <div className="flex flex-col items-center gap-3">
                      <span className="inline-flex items-center justify-center size-12 rounded-full bg-gold/15 text-gold">
                        <UploadCloud className="size-6" />
                      </span>
                      {order.audio_url ? (
                        <>
                          <p className="font-serif text-lg text-navy">
                            Audio ready
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Click to replace
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-serif text-lg text-navy">
                            Upload their audio
                          </p>
                          <p className="text-sm text-muted-foreground">
                            MP3 · WAV · M4A · up to 50MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <Checkbox
                      checked={order.send_link_later}
                      onCheckedChange={(checked) =>
                        setOrder((prev) => ({
                          ...prev,
                          send_link_later: checked === true,
                        }))
                      }
                      className="mt-0.5 border-navy/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-navy"
                    />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      I'm not ready yet — send me an upload link after checkout.
                    </span>
                  </label>
                </div>

                {/* Legal consent */}
                <div className="rounded-2xl bg-card border border-border/60 p-5 md:p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={order.audio_consent}
                      onCheckedChange={(checked) =>
                        handleConsentChange(checked === true)
                      }
                      required
                      className="mt-0.5 border-navy/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-navy"
                    />
                    <span className="text-sm text-navy leading-relaxed">
                      I confirm I have the right to upload this audio and agree to
                      the{" "}
                      <a
                        href="/terms/audio-upload"
                        className="underline decoration-gold/60 underline-offset-2 hover:text-gold"
                      >
                        Key of Hearts Audio Upload Terms
                      </a>
                      .
                    </span>
                  </label>
                </div>
              </div>
            )}
          </Step>
        )}

        {order.tier === "signature" && (
          <Step
            index="02"
            title="What moment are you celebrating?"
            subtitle="Every occasion has its own song."
          >
            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl">
              {OCCASIONS.map((occ) => (
                <OccasionCard
                  key={occ}
                  label={occ}
                  selected={order.occasion === occ}
                  onSelect={() => handleSelectOccasion(occ)}
                />
              ))}
            </div>

            {order.occasion && (
              <div
                ref={detailsRef}
                className="max-w-5xl mt-12 md:mt-16 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <button
                  type="button"
                  onClick={handleChangeOccasion}
                  className="text-xs text-muted-foreground hover:text-gold underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-gold transition-colors mb-6"
                >
                  Change occasion
                </button>

                <div className="grid md:grid-cols-3 gap-5 md:gap-6">
                  {SONG_VERSIONS.map((song) => (
                    <SongCard
                      key={song.value}
                      label={song.label}
                      title={song.title}
                      selected={order.song_version === song.value}
                      onSelect={() =>
                        setOrder((prev) => ({ ...prev, song_version: song.value }))
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </Step>
        )}
      </div>
    </main>
  );
};

// ----- Step shell ---------------------------------------------------------

const Step = ({
  index,
  title,
  subtitle,
  children,
}: {
  index: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <section className="container py-16 md:py-24">
    <div className="max-w-3xl mb-10 md:mb-12">
      <p className="font-serif text-gold text-2xl md:text-3xl mb-3">{index}</p>
      <h2 className="font-serif text-3xl md:text-5xl text-navy text-balance leading-[1.1]">
        {title}
      </h2>
      <p className="text-muted-foreground text-lg mt-4 text-balance">{subtitle}</p>
    </div>
    {children}
  </section>
);

// ----- Tier card ----------------------------------------------------------

const TierCard = ({
  label,
  heading,
  subtext,
  examples,
  price,
  cta,
  selected,
  onSelect,
}: {
  label: string;
  heading: string;
  subtext: string;
  examples: string;
  price: string;
  cta: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "relative text-left rounded-3xl bg-card p-7 md:p-9 border transition-all duration-300 flex flex-col",
      "hover:-translate-y-0.5 hover:shadow-card",
      selected
        ? "border-gold ring-2 ring-gold/40 shadow-card"
        : "border-border/60",
    )}
  >
    {selected && (
      <span className="absolute top-5 right-5 inline-flex items-center justify-center size-8 rounded-full bg-gold text-navy shadow-gold">
        <Check className="size-4" strokeWidth={3} />
      </span>
    )}

    <p className="label-eyebrow text-gold mb-4">{label}</p>
    <h3 className="font-serif text-2xl md:text-3xl text-navy leading-tight mb-3 text-balance pr-10">
      {heading}
    </h3>
    <p className="text-muted-foreground leading-relaxed mb-4">{subtext}</p>
    <p className="italic text-muted-foreground text-sm mb-7">{examples}</p>

    <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-border/60">
      <span className="font-serif text-lg text-navy">{price}</span>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5 h-11 text-sm font-medium transition-colors",
          selected
            ? "bg-gold text-navy"
            : "bg-navy text-cream group-hover:bg-navy-deep",
        )}
      >
        {cta}
      </span>
    </div>
  </button>
);

// ----- Occasion card ------------------------------------------------------

const OccasionCard = ({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "relative text-left rounded-2xl bg-card p-4 md:p-5 border transition-all duration-200 min-h-[72px] flex items-center pr-10",
      "hover:-translate-y-0.5 hover:border-gold hover:shadow-soft",
      selected
        ? "border-gold ring-2 ring-gold/40 shadow-soft"
        : "border-border/60",
    )}
  >
    <span className="font-serif text-base md:text-lg text-navy leading-snug text-balance">
      {label}
    </span>
    {selected && (
      <span className="absolute top-3 right-3 inline-flex items-center justify-center size-6 rounded-full bg-gold text-navy">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    )}
  </button>
);

// ----- Song card ----------------------------------------------------------

const SongCard = ({
  label,
  title,
  selected,
  onSelect,
}: {
  label: string;
  title: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <div
    className={cn(
      "relative rounded-2xl bg-card p-6 border transition-all duration-300 flex flex-col",
      selected ? "border-gold ring-2 ring-gold/40 shadow-card" : "border-border/60",
    )}
  >
    {selected && (
      <span className="absolute top-4 right-4 inline-flex items-center justify-center size-7 rounded-full bg-gold text-navy shadow-gold">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    )}

    <p className="label-eyebrow text-gold mb-3">{label}</p>
    <h3 className="font-serif text-xl md:text-2xl text-navy leading-tight mb-5 pr-8">
      {title}
    </h3>

    {/* Player placeholder */}
    <div className="flex items-center gap-3 mb-6">
      <button
        type="button"
        aria-label={`Play ${title}`}
        className="inline-flex items-center justify-center size-11 rounded-full bg-navy text-cream hover:bg-navy-deep transition-colors flex-shrink-0"
      >
        <Play className="size-4 ml-0.5" fill="currentColor" />
      </button>
      <div className="flex-1 h-1.5 rounded-full bg-border/60 overflow-hidden">
        <div className="h-full w-0 bg-gold rounded-full" />
      </div>
    </div>

    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "mt-auto inline-flex items-center justify-center rounded-full h-11 px-5 text-sm font-medium border-2 transition-all",
        selected
          ? "bg-gold text-navy border-gold"
          : "bg-transparent text-navy border-gold hover:bg-gold/10",
      )}
    >
      {selected ? "Selected" : "Choose this song"}
    </button>
  </div>
);

export default Start;
