import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  ({ className, onLoad, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <img
        ref={ref}
        loading="lazy"
        {...props}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cn(
          "transition-[filter,opacity,transform] duration-700 ease-out",
          loaded ? "blur-0 opacity-100 scale-100" : "blur-md opacity-70 scale-[1.03]",
          className
        )}
      />
    );
  }
);
LazyImage.displayName = "LazyImage";
