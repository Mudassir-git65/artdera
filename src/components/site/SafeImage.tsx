import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { reportImageError } from "@/lib/lovable-error-reporting";
import { cn } from "@/lib/utils";

export type SafeImageSource = {
  srcSet: string;
  type?: "image/avif" | "image/webp";
  media?: string;
  sizes?: string;
};

type SafeImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "loading"
> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  loading?: "eager" | "lazy";
  sources?: SafeImageSource[];
  showSkeleton?: boolean;
  section?: string;
};

const DEFAULT_FALLBACK = "/images/fallbacks/artwork-placeholder.webp";

export function buildImageSources(
  src: string,
  widths: number[],
  sizes?: string,
): SafeImageSource[] {
  const match = src.match(/^(.*)-(\d+)\.(webp|avif)$/i);
  if (!match) return [];
  const stem = match[1];
  return [
    {
      type: "image/avif",
      srcSet: widths.map((width) => `${stem}-${width}.avif ${width}w`).join(", "),
      sizes,
    },
    {
      type: "image/webp",
      srcSet: widths.map((width) => `${stem}-${width}.webp ${width}w`).join(", "),
      sizes,
    },
  ];
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className,
  containerClassName,
  fallbackSrc = DEFAULT_FALLBACK,
  objectFit = "cover",
  loading,
  sources = [],
  showSkeleton = false,
  section = "unknown",
  onLoad,
  onError,
  style,
  ...props
}: SafeImageProps) {
  const previousSrc = useRef(src);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (previousSrc.current !== src) {
      previousSrc.current = src;
      setUsingFallback(false);
      setFallbackFailed(false);
      setIsLoading(showSkeleton);
    }
  }, [showSkeleton, src]);

  const currentSrc = usingFallback ? fallbackSrc : src;
  const activeSources = usingFallback ? [] : sources;

  if (fallbackFailed) {
    return (
      <span
        className={cn(
          "flex h-full w-full items-center justify-center bg-[var(--porcelain)] px-4 text-center text-xs text-muted-foreground",
          containerClassName,
        )}
        role="img"
        aria-label={alt}
      >
        Image unavailable
      </span>
    );
  }

  return (
    <span className={cn("relative block overflow-hidden", containerClassName)}>
      <picture className="contents">
        {activeSources.map((source) => (
          <source
            key={`${source.type ?? "image"}-${source.media ?? "all"}-${source.srcSet}`}
            srcSet={source.srcSet}
            type={source.type}
            media={source.media}
            sizes={source.sizes ?? sizes}
          />
        ))}
        <img
          {...props}
          src={currentSrc}
          alt={alt}
          data-fallback-src={fallbackSrc}
          data-image-section={section}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : (loading ?? "lazy")}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className={cn("h-full w-full", className)}
          style={{ objectFit, ...style }}
          onLoad={(event) => {
            setIsLoading(false);
            onLoad?.(event);
          }}
          onError={(event) => {
            reportImageError(src, section);
            onError?.(event);
            if (!usingFallback && fallbackSrc && fallbackSrc !== src) {
              setUsingFallback(true);
              setIsLoading(showSkeleton);
              return;
            }
            setFallbackFailed(true);
            setIsLoading(false);
          }}
        />
      </picture>
      {showSkeleton && isLoading && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,var(--porcelain)_20%,var(--ivory)_50%,var(--porcelain)_80%)] bg-[length:200%_100%] motion-safe:animate-[pulse_1.4s_ease-in-out_infinite]"
        />
      )}
    </span>
  );
}
