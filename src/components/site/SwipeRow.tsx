import { useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

type SwipeRowProps = {
  children: ReactNode[];
  /** Tailwind basis class controlling card width (e.g. "basis-[75%]") */
  basis: string;
};

export const SwipeRow = ({ children, basis }: SwipeRowProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
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
    <div>
      <div ref={emblaRef} className="overflow-hidden -mx-4 md:-mx-6">
        <div className="flex gap-4 md:gap-6 px-4 md:px-6">
          {children.map((child, i) => (
            <div key={i} className={cn("min-w-0 shrink-0", basis)}>
              {child}
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
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                selected === i ? "w-6 bg-gold" : "w-1.5 bg-gold/30",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
