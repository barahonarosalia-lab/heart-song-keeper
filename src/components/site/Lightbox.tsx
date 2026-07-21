import { useEffect } from "react";
import { X } from "lucide-react";

interface LightboxProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export const Lightbox = ({ src, alt, onClose }: LightboxProps) => {
  useEffect(() => {
    if (!src) return;
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-cream flex items-center justify-center transition-colors"
      >
        <X size={20} />
      </button>
      <img
        src={src}
        alt={alt ?? ""}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      />
    </div>
  );
};
