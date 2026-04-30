import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Collection = {
  name: string;
  slug: string;
  img: string;
  comingSoon?: boolean;
};

type Props = {
  collection: Collection | null;
  onClose: () => void;
};

export const CollectionGalleryOverlay = ({ collection, onClose }: Props) => {
  const navigate = useNavigate();

  const handleSelectArt = (artNumber: number) => {
    if (!collection) return;
    onClose();
    navigate(`/start?collection=${collection.slug}&art=${artNumber}`);
  };

  // Lock body scroll while open
  useEffect(() => {
    if (!collection) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [collection]);

  // Reset expanded state on collection change
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  useEffect(() => {
    setExpandedIndex(null);
  }, [collection?.slug]);

  // Esc to close
  useEffect(() => {
    if (!collection) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (expandedIndex !== null) setExpandedIndex(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collection, expandedIndex, onClose]);

  if (!collection) return null;

  // Coming soon variant
  if (collection.comingSoon) {
    return (
      <div className="fixed inset-0 z-[100] bg-navy text-cream overflow-y-auto">
        <div className="absolute inset-0 starfield opacity-25 pointer-events-none" />
        <div className="relative container max-w-md mx-auto pt-6 pb-16 px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm text-cream/80 hover:text-cream transition-colors"
          >
            <ArrowLeft className="size-4" /> Back
          </button>

          <div className="mt-24 text-center space-y-6">
            <p className="label-eyebrow text-gold">Coming Soon</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gold">{collection.name}</h2>
            <p className="text-cream/80 text-base md:text-lg leading-relaxed max-w-sm mx-auto">
              This collection is coming soon. We'll let you know when it's ready.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
                if (!input?.value) return;
                // TODO: wire to backend / n8n
                input.value = "";
                alert("Thank you — we'll be in touch.");
              }}
              className="pt-4 max-w-sm mx-auto space-y-3"
            >
              <Input
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="bg-cream/10 border-cream/30 text-cream placeholder:text-cream/50 focus-visible:ring-gold"
              />
              <Button type="submit" variant="gold" className="w-full">
                Notify me <ArrowRight className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Build 10 placeholder slots — repeat the collection hero for now
  const images = Array.from({ length: 10 }, (_, i) => ({
    src: collection.img,
    index: i + 1,
  }));

  return (
    <div className="fixed inset-0 z-[100] bg-navy text-cream flex flex-col overflow-hidden">
      <div className="absolute inset-0 starfield opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative pt-5 pb-4 px-5 md:px-8 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => (expandedIndex !== null ? setExpandedIndex(null) : onClose())}
          className="inline-flex items-center gap-1.5 text-sm text-cream/80 hover:text-cream transition-colors z-10"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <p className="label-eyebrow text-gold absolute left-1/2 -translate-x-1/2 top-6 text-center">
          {collection.name}
        </p>
        <span className="w-12" aria-hidden />
      </div>

      {expandedIndex === null ? (
        <GalleryView
          images={images}
          onPreview={setExpandedIndex}
          onSelectArt={handleSelectArt}
        />
      ) : (
        <ExpandedView
          collection={collection}
          images={images}
          startIndex={expandedIndex}
          onChangeIndex={setExpandedIndex}
          onSelectArt={handleSelectArt}
        />
      )}
    </div>
  );
};

// ---------------- Gallery (mobile carousel + desktop grid) ----------------

const GalleryView = ({
  images,
  onPreview,
  onSelectArt,
}: {
  images: { src: string; index: number }[];
  onPreview: (i: number) => void;
  onSelectArt: (artNumber: number) => void;
}) => {
  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      {/* Mobile: swipe carousel */}
      <div className="md:hidden flex-1 flex flex-col justify-center pb-8">
        <MobileGallery images={images} onPreview={onPreview} onSelectArt={onSelectArt} />
      </div>

      {/* Desktop: scrollable grid */}
      <div className="hidden md:block flex-1 overflow-y-auto px-8 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {images.map((img, i) => (
            <div key={i} className="group">
              <button
                type="button"
                onClick={() => onSelectArt(img.index)}
                className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl"
                aria-label={`Select art ${img.index}`}
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold/30 bg-navy/40 shadow-card">
                  <img
                    src={img.src}
                    alt={`Art ${img.index}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Preview chip — opens expanded view without selecting */}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onPreview(i);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        e.preventDefault();
                        onPreview(i);
                      }
                    }}
                    className="absolute top-3 right-3 text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-navy/70 text-cream/90 backdrop-blur border border-cream/20 hover:bg-navy/90 cursor-pointer"
                  >
                    Preview
                  </span>
                </div>
              </button>
              <p className="mt-3 text-center text-[11px] tracking-[0.25em] uppercase text-gold/80 group-hover:text-gold transition-colors">
                Art {img.index}
              </p>
              <Button
                type="button"
                variant="gold"
                size="sm"
                className="mt-2 w-full"
                onClick={() => onSelectArt(img.index)}
              >
                <Check className="size-4" /> Select this art
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MobileGallery = ({
  images,
  onPreview,
  onSelectArt,
}: {
  images: { src: string; index: number }[];
  onPreview: (i: number) => void;
  onSelectArt: (artNumber: number) => void;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", containScroll: "trimSnaps" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setSelected(emblaApi.selectedScrollSnap());
      setSnaps(emblaApi.scrollSnapList());
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="min-w-0 shrink-0 basis-[85%] first:pl-[7.5%] last:pr-[7.5%]"
            >
              <button
                type="button"
                onClick={() => onSelectArt(img.index)}
                className="block w-full focus:outline-none"
                aria-label={`Select art ${img.index}`}
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold/30 bg-navy/40 shadow-card">
                  <img
                    src={img.src}
                    alt={`Art ${img.index}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onPreview(i);
                    }}
                    className="absolute top-3 right-3 text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-navy/70 text-cream/90 backdrop-blur border border-cream/20"
                  >
                    Preview
                  </span>
                </div>
              </button>
              <p className="mt-3 text-center text-[11px] tracking-[0.25em] uppercase text-gold/80">
                Art {img.index}
              </p>
              <Button
                type="button"
                variant="gold"
                size="sm"
                className="mt-2 w-full"
                onClick={() => onSelectArt(img.index)}
              >
                <Check className="size-4" /> Select this art
              </Button>
            </div>
          ))}
        </div>
      </div>

      {snaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to art ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                selected === i ? "w-6 bg-gold" : "w-1.5 bg-gold/30",
              )}
            />
          ))}
        </div>
      )}
    </>
  );
};

// ---------------- Expanded image view ----------------

const ExpandedView = ({
  collection,
  images,
  startIndex,
  onChangeIndex,
  onSelectArt,
}: {
  collection: Collection;
  images: { src: string; index: number }[];
  startIndex: number;
  onChangeIndex: (i: number) => void;
  onSelectArt: (artNumber: number) => void;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", startIndex, loop: false });
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      const idx = emblaApi.selectedScrollSnap();
      setCurrent(idx);
      onChangeIndex(idx);
    };
    emblaApi.on("select", update);
    return () => {
      emblaApi.off("select", update);
    };
  }, [emblaApi, onChangeIndex]);

  const artNumber = images[current]?.index ?? current + 1;

  const goPrev = () => emblaApi?.scrollPrev();
  const goNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative flex-1 flex flex-col md:flex-row min-h-0">
      {/* Image area */}
      <div className="relative flex-1 min-h-0 flex items-center">
        <div ref={emblaRef} className="overflow-hidden flex-1 h-full">
          <div className="flex h-full">
            {images.map((img, i) => (
              <div
                key={i}
                className="min-w-0 shrink-0 basis-full h-full flex items-center justify-center px-5 md:px-10 py-4"
              >
                <img
                  src={img.src}
                  alt={`Art ${img.index}`}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop arrow controls */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous art"
          className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 size-11 rounded-full bg-cream/10 hover:bg-cream/20 border border-cream/20 items-center justify-center text-cream backdrop-blur transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next art"
          className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 size-11 rounded-full bg-cream/10 hover:bg-cream/20 border border-cream/20 items-center justify-center text-cream backdrop-blur transition-colors"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>

      {/* Info card — bottom sheet on mobile, side panel on desktop */}
      <div className="bg-cream text-navy shadow-2xl px-6 pt-5 pb-6 animate-slide-up-card rounded-t-3xl md:rounded-none md:rounded-l-3xl md:w-[360px] lg:w-[420px] md:shrink-0 md:flex md:flex-col md:justify-center md:py-12 md:px-10 md:animate-none">
        <div className="max-w-md mx-auto md:mx-0 space-y-3 md:space-y-5 w-full">
          <div className="flex items-center justify-between md:flex-col md:items-start md:gap-2">
            <p className="label-eyebrow text-gold">{collection.name}</p>
            <p className="text-[11px] tracking-[0.25em] uppercase text-navy/60">
              Art {artNumber} of {images.length}
            </p>
          </div>
          <p className="font-serif text-lg md:text-2xl text-navy">
            From $29 · Signature or Preserve
          </p>
          <Button
            type="button"
            variant="gold"
            className="w-full"
            onClick={() => onSelectArt(artNumber)}
          >
            <Check className="size-4" /> Select this art
          </Button>
          <p className="text-xs text-muted-foreground text-center md:text-left">
            You'll choose your product and personalize next
          </p>
        </div>
      </div>
    </div>
  );
};
