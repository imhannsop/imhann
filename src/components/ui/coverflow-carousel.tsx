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
  /** Tech-stack / keyword badges */
  tags?: string[];
  /** GitHub repo URL */
  githubUrl?: string;
  /** Live demo URL */
  liveUrl?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Show title + subtitle + tags + links beneath the carousel */
  showCaption?: boolean;
  /** Show left / right arrow buttons */
  showNavigation?: boolean;
  /** Show dot pagination */
  showPagination?: boolean;
  /** Auto-rotate interval in ms (0 = disabled) */
  autoPlay?: number;
  /** Extra className on the root wrapper */
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

  /* ---------- helpers ---------- */

  const go = useCallback(
    (dir: 1 | -1) =>
      setActive((prev) => (prev + dir + total) % total),
    [total],
  );

  const goTo = useCallback((idx: number) => setActive(idx), []);

  /* ---------- autoplay ---------- */

  useEffect(() => {
    if (!autoPlay) return;
    intervalRef.current = setInterval(() => go(1), autoPlay);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, go]);

  /* pause on hover */
  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const resume = () => {
    if (!autoPlay) return;
    intervalRef.current = setInterval(() => go(1), autoPlay);
  };

  /* ---------- swipe ---------- */

  const onTouchStart = (e: ReactTouchEvent) => {
    touchRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchRef.current;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    touchRef.current = null;
  };

  /* ---------- keyboard ---------- */

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  /* ---------- per-slide style ---------- */

  const slideStyle = (idx: number): React.CSSProperties => {
    const offset = idx - active;
    const abs = Math.abs(offset);

    // Only render neighbours within ±2
    if (abs > 2) return { opacity: 0, pointerEvents: "none", position: "absolute" };

    const translateX = offset * 260;           // horizontal spread
    const translateZ = -abs * 180;             // depth
    const rotateY = offset < 0 ? 45 : offset > 0 ? -45 : 0;
    const scale = offset === 0 ? 1 : 0.78;
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

  /* ---------- active slide data ---------- */

  const current = slides[active];

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

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
        className="relative flex items-center justify-center w-full overflow-hidden"
        style={{ perspective: "1200px", height: "340px" }}
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
            <div className="relative overflow-hidden rounded-[4px] border border-border-dim shadow-[0_8px_32px_rgba(0,0,0,.55)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={typeof slide.src === "string" ? slide.src : slide.src.src}
                alt={slide.alt ?? slide.title ?? `Slide ${idx + 1}`}
                className="block h-[260px] w-[460px] object-cover sm:h-[300px] sm:w-[520px]"
                draggable={false}
              />
              {/* subtle gloss overlay on active */}
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
      {showPagination && total > 1 && (
        <div className="flex items-center gap-2" role="tablist">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
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
        <div className="w-full max-w-xl space-y-3 text-center px-4">
          {/* title */}
          {current.title && (
            <h3 className="text-lg sm:text-xl font-bold text-text-bright tracking-tight">
              {current.title}
            </h3>
          )}

          {/* subtitle / description */}
          {current.subtitle && (
            <p className="text-sm sm:text-base text-text-dim leading-relaxed">
              {current.subtitle}
            </p>
          )}

          {/* tags */}
          {current.tags && current.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[3px] border border-border-dim px-2.5 py-1 font-mono text-xs text-amber"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* action buttons */}
          {(current.githubUrl || current.liveUrl) && (
            <div className="flex items-center justify-center gap-3 pt-2">
              {current.githubUrl && (
                <a
                  href={current.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border-3 border-black bg-bg-panel px-3.5 py-2 text-xs font-medium text-text-bright no-underline shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-bg-raised hover:text-purple transition-all cursor-pointer"
                >
                  <Code2 size={14} />
                  View GitHub ↗
                </a>
              )}
              {current.liveUrl && (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border-3 border-black bg-bg-panel px-3.5 py-2 text-xs font-medium text-text-bright no-underline shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-bg-raised hover:text-purple transition-all cursor-pointer"
                >
                  <ExternalLink size={14} />
                  Live Demo ↗
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
