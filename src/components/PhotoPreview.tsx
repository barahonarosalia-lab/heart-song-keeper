import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { UploadCloud, X, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export type PhotoPreviewProduct = "canvas" | "blanket" | "digital";
export type PhotoQualityState = "green" | "yellow" | "red";

interface Props {
  product: PhotoPreviewProduct;
  value: string; // data URL
  onChange: (dataUrl: string) => void;
  blanketOrientation?: "portrait" | "landscape";
  quality: PhotoQualityState | null;
  onQualityChange: (q: PhotoQualityState | null) => void;
  acknowledged: boolean;
  onAcknowledgedChange: (v: boolean) => void;
  onCropAreaChange: (area: Area | null, zoom: number) => void;
}

const ACCEPT = "image/jpeg,.jpg,.jpeg";

function aspectFor(
  product: PhotoPreviewProduct,
  orientation: "portrait" | "landscape",
): number {
  if (product === "canvas") return 14 / 11; // landscape by default
  if (product === "blanket") return orientation === "landscape" ? 60 / 50 : 50 / 60;
  return 1; // digital
}

function classifyQuality(
  product: PhotoPreviewProduct,
  width: number,
  height: number,
): PhotoQualityState {
  const longest = Math.max(width, height);
  const shortest = Math.min(width, height);
  if (product === "blanket") {
    if (longest >= 2650) return "green";
    if (longest >= 1600) return "yellow";
    return "red";
  }
  // canvas + digital
  if (shortest >= 2800) return "green";
  if (shortest >= 1700) return "yellow";
  return "red";
}

export default function PhotoPreview({
  product,
  value,
  onChange,
  blanketOrientation = "portrait",
  quality,
  onQualityChange,
  acknowledged,
  onAcknowledgedChange,
  onCropAreaChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [, setCroppedArea] = useState<Area | null>(null);

  const aspect = aspectFor(product, blanketOrientation);

  const handleFile = useCallback(
    (file: File | null) => {
      setError(null);
      if (!file) return;
      const isJpeg =
        file.type === "image/jpeg" ||
        /\.jpe?g$/i.test(file.name);
      if (!isJpeg) {
        setError("Please upload a JPG or JPEG image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || "");
        const img = new Image();
        img.onload = () => {
          const q = classifyQuality(product, img.naturalWidth, img.naturalHeight);
          onQualityChange(q);
          onAcknowledgedChange(false);
          onChange(dataUrl);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
        };
        img.onerror = () => setError("Could not read that image. Please try another.");
        img.src = dataUrl;
      };
      reader.onerror = () => setError("Could not read that file. Please try another.");
      reader.readAsDataURL(file);
    },
    [product, onChange, onQualityChange, onAcknowledgedChange],
  );

  // Re-classify if product changes with an existing photo
  useEffect(() => {
    if (!value) return;
    const img = new Image();
    img.onload = () => {
      const q = classifyQuality(product, img.naturalWidth, img.naturalHeight);
      onQualityChange(q);
    };
    img.src = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, blanketOrientation]);

  if (!value) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-2xl border-2 border-dashed border-gold/50 bg-cream-warm/40 hover:bg-cream-warm/70 hover:border-gold transition-colors p-10 md:p-14 flex flex-col items-center gap-3 text-center"
        >
          <UploadCloud className="w-8 h-8 text-gold" />
          <div className="font-serif text-xl text-navy">Upload a photo</div>
          <div className="text-sm text-muted-foreground">
            JPG or JPEG only. High-resolution recommended.
          </div>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {error && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    );
  }

  const qColor =
    quality === "green"
      ? "text-emerald-600"
      : quality === "yellow"
        ? "text-amber-600"
        : "text-destructive";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden bg-navy/95 border border-border/60 shadow-card">
        <div className="relative w-full" style={{ aspectRatio: String(aspect) }}>
          <Cropper
            image={value}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, area) => {
              setCroppedArea(area);
              onCropAreaChange(area, zoom);
            }}
            showGrid={false}
            objectFit="contain"
          />

          {/* Product-specific overlays */}
          {product === "blanket" && (
            <div className="absolute inset-0 pointer-events-none">
              {/* 4 QR ghost boxes */}
              {[
                { top: "7.14%", left: "8.49%" },
                { top: "7.14%", right: "8.49%" },
                { bottom: "7.14%", left: "8.49%" },
                { bottom: "7.14%", right: "8.49%" },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute rounded-md border border-gold/80 bg-cream/25 backdrop-blur-[1px] flex items-center justify-center"
                  style={{
                    width: "4.25%",
                    height: "4.25%",
                    ...pos,
                  }}
                >
                  <span className="text-[8px] font-serif text-cream/90">QR</span>
                </div>
              ))}
            </div>
          )}

          {product === "canvas" && (
            <div
              className="absolute top-0 left-0 right-0 pointer-events-none bg-navy/55 border-b border-gold/40 flex items-center justify-center px-3"
              style={{ height: "8.82%" }}
            >
              <p className="text-[10px] md:text-xs text-cream/90 font-sans text-center leading-tight">
                Wraps around the frame edge — keep faces below this line.
              </p>
            </div>
          )}
        </div>

        {/* Zoom slider */}
        <div className="px-4 py-3 bg-navy flex items-center gap-3 border-t border-gold/20">
          <span className="text-[10px] tracking-[0.2em] uppercase text-gold/80">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-gold"
          />
        </div>
      </div>

      {/* Actions + quality */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className={cn("text-sm font-medium flex items-center gap-2", qColor)}>
          <span className="inline-block w-2 h-2 rounded-full bg-current" />
          {quality === "green" && "Great resolution"}
          {quality === "yellow" && "Below ideal resolution"}
          {quality === "red" && "Low resolution"}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <RefreshCw className="w-4 h-4 mr-1.5" /> Replace photo
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange("");
              onQualityChange(null);
              onAcknowledgedChange(false);
            }}
          >
            <X className="w-4 h-4 mr-1.5" /> Remove
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </p>
      )}

      {quality === "yellow" && (
        <div className="rounded-xl border border-amber-500/60 bg-amber-50 p-4 space-y-2">
          <p className="text-sm text-amber-900">
            Your photo will print softer than ideal — for the sharpest result, a
            higher resolution image is recommended.
          </p>
          <label className="flex items-start gap-2 text-sm text-amber-900 cursor-pointer">
            <Checkbox
              checked={acknowledged}
              onCheckedChange={(v) => onAcknowledgedChange(v === true)}
              className="mt-0.5"
            />
            <span>I understand and want to use this photo.</span>
          </label>
        </div>
      )}

      {quality === "red" && (
        <div className="rounded-xl border border-destructive/60 bg-destructive/5 p-4 space-y-2">
          <p className="text-sm text-destructive font-medium">
            This photo will likely print visibly blurry or pixelated at this size —
            only proceed if this is your only option, such as a treasured older or
            vintage photo.
          </p>
          <label className="flex items-start gap-2 text-sm text-destructive cursor-pointer">
            <Checkbox
              checked={acknowledged}
              onCheckedChange={(v) => onAcknowledgedChange(v === true)}
              className="mt-0.5"
            />
            <span>I understand and want to use this photo anyway.</span>
          </label>
        </div>
      )}
    </div>
  );
}
