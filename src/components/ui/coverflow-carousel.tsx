"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { ChevronLeft, ChevronRight, Code2, ExternalLink } from "lucide-react";
import type { StaticImageData } from "next/image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CoverflowSlide {
  src: string | StaticImageData;
  alt?: string;
  title?: string;
  subtitle?: string;
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  showCaption?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
  autoPlay?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CoverflowCarousel({
  slides,
  showCaption = false,
  showNavigation = false,
  showPagination = false,
  autoPlay = 0,
  className = "",
}: CoverflowCarouselProps) {
  const [active, setActive] = useState(0);
  const touchRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = slides.length;

  const go = useCallback(
    (dir: 1 | -1) => setActive((prev) => (prev + dir + total) % total),
    [total],
  );

  const goTo = useCallback((idx: number) => setActive(idx), []);

  useEffect(() => {
    if (!autoPlay) return;
    intervalRef.current = setInterval(() => go(1), autoPlay);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, go]);

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const resume = () => {
    if (!autoPlay) return;
    intervalRef.current = setInterval(() => go(1), autoPlay);
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    touchRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchRef.current;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    touchRef.current = null;
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  /* ---------- per-slide style ---------- */
  const slideStyle = (idx: number): React.CSSProperties => {
    const offset = idx - active;
    const abs = Math.abs(offset);

    if (abs > 2) return { opacity: 0, pointerEvents: "none", position: "absolute" };

    const translateX = offset * 220;
    const translateZ = -abs * 150;
    const rotateY = offset < 0 ? 40 : offset > 0 ? -40 : 0;
    const scale = offset === 0 ? 1 : 0.75;
    const opacity = offset === 0 ? 1 : abs === 1 ? 0.6 : 0.3;
    const zIndex = 10 - abs;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      position: "absolute",
      transition: "all 0.5s cubic-bezier(.4, 0, .2, 1)",
    };
  };

  const current = slides[active];

  return (
    <div
      className={`relative flex flex-col items-center gap-6 select-none ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onKeyDown={onKey}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Project showcase"
    >
      {/* ---- stage ---- */}
      <div
        className="relative flex items-center justify-center w-full overflow-visible h-[260px] sm:h-[300px]"
        style={{ perspective: "1200px" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="cursor-pointer"
            style={slideStyle(idx)}
            onClick={() => (idx === active ? undefined : goTo(idx))}
            aria-hidden={idx !== active}
          >
            <div className="relative overflow-hidden rounded-xl border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <img
                src={typeof slide.src === "string" ? slide.src : slide.src.src}
                alt={slide.alt ?? slide.title ?? `Slide ${idx + 1}`}
                className="block h-[260px] w-[460px] object-cover sm:h-[300px] sm:w-[520px]"
                draggable={false}
              />
              {idx === active && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[.06] to-transparent" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ---- navigation arrows ---- */}
      {showNavigation && total > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-xl border-3 border-black bg-bg-panel text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-bg-raised cursor-pointer transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-xl border-3 border-black bg-bg-panel text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-bg-raised cursor-pointer transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* ---- pagination dots ---- */}
      {showPagination && (
        <div className="flex h-1.5 items-center gap-2 mt-1" role="tablist">
          {total > 1 &&
            slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-1.5 rounded-full border border-black transition-all duration-300 cursor-pointer ${
                  idx === active
                    ? "w-6 bg-text-bright"
                    : "w-1.5 bg-border hover:bg-text-dim"
                }`}
                role="tab"
                aria-selected={idx === active}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
        </div>
      )}

      {/* ---- caption block ---- */}
      {showCaption && current && (
        <div className="flex w-full max-w-xl flex-col items-center gap-3 overflow-hidden px-4 text-center min-h-[164px] sm:min-h-[184px]">
          <h3 className="truncate text-lg sm:text-xl font-bold text-text-bright tracking-tight">
            {current.title}
          </h3>

          <p className="line-clamp-2 h-[2.6rem] sm:h-[3rem] text-sm sm:text-base text-text-dim leading-relaxed">
            {current.subtitle}
          </p>

          <div className="flex min-h-8 max-h-8 flex-wrap justify-center gap-2 overflow-hidden">
            {current.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-md border-2 border-black bg-bg-panel px-2.5 py-1 font-mono text-xs text-amber"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex min-h-[38px] items-center justify-center gap-3">
            {current.githubUrl && (
              <a
                href={current.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border-3 border-black bg-bg-panel px-3.5 py-2 text-xs font-medium text-text-bright no-underline shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-bg-raised hover:text-purple hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
              >
                <Code2 size={14} />
                GitHub
              </a>
            )}
            {current.liveUrl && (
              <a
                href={current.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border-3 border-black bg-bg-panel px-3.5 py-2 text-xs font-medium text-text-bright no-underline shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-bg-raised hover:text-purple hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
