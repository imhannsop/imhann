"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type PointerEvent as ReactPointerEvent,
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
/*  Tunables                                                           */
/* ------------------------------------------------------------------ */

// Spring constants for the 3D stage — underdamped on purpose so the stack
// settles with a small, quick overshoot rather than snapping or easing
// linearly. Same shape of motion niri uses for its workspace-switch springs.
const STIFFNESS = 180;
const DAMPING = 20;
const SETTLE_EPSILON = 0.0015;

const SPACING_PX = 220; // horizontal offset per index step
const DEPTH_PX = 150; // translateZ falloff per index step
const MAX_ROTATE_DEG = 40;
const DRAG_CLICK_THRESHOLD = 6; // px of movement before a drag suppresses the click
const FLING_PROJECTION_MS = 120; // how far ahead (ms) drag velocity is projected to pick a landing slide

/** Shortest signed distance from `position` to `idx` around a circle of size `total`. */
function wrapOffset(idx: number, position: number, total: number) {
  let diff = idx - position;
  diff -= Math.round(diff / total) * total;
  return diff;
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
  const total = slides.length;

  // `active` is the discrete, wrapped "current slide" used for captions,
  // aria state, and pagination highlighting — it updates the instant the
  // user expresses intent (click/keypress/drag-release).
  const [active, setActive] = useState(0);

  // `position` is the continuous, UNwrapped stage position that the spring
  // animates toward `targetRef.current`. Keeping it unbounded (rather than
  // modulo-ing it every frame) means crossing the first/last slide boundary
  // never causes a visual jump — wrapOffset() resolves the shortest visual
  // path from this raw value at render time.
  const [position, setPosition] = useState(0);

  const targetRef = useRef(0);
  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const draggingRef = useRef(false);
  const dragMovedRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragBasePositionRef = useRef(0);
  const lastDragXRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const dragVelocityPxMsRef = useRef(0); // px per ms, for fling momentum

  /* ---------- spring loop (3D stage) ---------- */

  const tick = useCallback((t: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = t;
    const dt = Math.min((t - lastTimeRef.current) / 1000, 0.032);
    lastTimeRef.current = t;

    const target = targetRef.current;
    const displacement = positionRef.current - target;
    const springForce = -STIFFNESS * displacement;
    const dampingForce = -DAMPING * velocityRef.current;
    velocityRef.current += (springForce + dampingForce) * dt;
    positionRef.current += velocityRef.current * dt;

    const settled =
      Math.abs(displacement) < SETTLE_EPSILON &&
      Math.abs(velocityRef.current) < SETTLE_EPSILON;

    if (settled) {
      positionRef.current = target;
      velocityRef.current = 0;
      setPosition(positionRef.current);
      runningRef.current = false;
      lastTimeRef.current = null;
      return;
    }

    setPosition(positionRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const ensureLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    lastTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  /* ---------- navigation ---------- */

  const go = useCallback(
    (dir: 1 | -1) => {
      targetRef.current += dir;
      setActive((prev) => (prev + dir + total) % total);
      ensureLoop();
    },
    [total, ensureLoop],
  );

  const goTo = useCallback(
    (idx: number) => {
      // Walk the target the *shortest* way around the circle to `idx`,
      // rather than jumping straight to it — this is what makes a click on
      // a dot three slides away visibly sweep through the ones between.
      const cur = targetRef.current;
      const curMod = ((cur % total) + total) % total;
      let diff = idx - curMod;
      diff -= Math.round(diff / total) * total;
      targetRef.current = cur + diff;
      setActive(idx);
      ensureLoop();
    },
    [total, ensureLoop],
  );

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

  /* ---------- pointer drag (mouse + touch, unified) ---------- */

  const onPointerDown = (e: ReactPointerEvent) => {
    draggingRef.current = true;
    dragMovedRef.current = 0;
    dragStartXRef.current = e.clientX;
    dragBasePositionRef.current = positionRef.current;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = performance.now();
    dragVelocityPxMsRef.current = 0;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pause();
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dtMs = Math.max(now - lastDragTimeRef.current, 1);
    dragVelocityPxMsRef.current = (e.clientX - lastDragXRef.current) / dtMs;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = now;

    const totalDeltaPx = e.clientX - dragStartXRef.current;
    dragMovedRef.current = Math.max(dragMovedRef.current, Math.abs(totalDeltaPx));

    const nextPosition = dragBasePositionRef.current - totalDeltaPx / SPACING_PX;
    positionRef.current = nextPosition;
    targetRef.current = nextPosition; // spring has nothing to chase while dragging
    setPosition(nextPosition);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    // Project a little ahead using the release velocity so a fast flick
    // lands on the next slide even if the finger didn't travel far — and
    // hand that velocity to the spring so the settle carries real momentum
    // instead of starting from a dead stop.
    const projected =
      positionRef.current - (dragVelocityPxMsRef.current * FLING_PROJECTION_MS) / SPACING_PX;
    const nearest = Math.round(projected);

    velocityRef.current = -(dragVelocityPxMsRef.current * 1000) / SPACING_PX;
    targetRef.current = nearest;
    setActive(((nearest % total) + total) % total);
    ensureLoop();
    resume();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  /* ---------- per-slide style (3D stage) ---------- */

  const slideStyle = (idx: number): React.CSSProperties => {
    const offset = wrapOffset(idx, position, total);
    const abs = Math.abs(offset);

    if (abs > 2.5) return { opacity: 0, pointerEvents: "none", position: "absolute" };

    const translateX = offset * SPACING_PX;
    const translateZ = -abs * DEPTH_PX;
    const rotateY = Math.max(-MAX_ROTATE_DEG, Math.min(MAX_ROTATE_DEG, -offset * MAX_ROTATE_DEG));
    const scale = Math.max(0.55, 1 - abs * 0.25);
    const opacity = abs <= 0 ? 1 : Math.max(0, 1 - abs * 0.42);
    const zIndex = Math.round(100 - abs * 10);

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      position: "absolute",
      willChange: "transform, opacity",
    };
  };

  const current = slides[active];

  return (
    <div
      className={`relative flex flex-col items-center gap-6 select-none ${className}`}
      onMouseEnter={pause}
      onMouseLeave={() => {
        if (!draggingRef.current) resume();
      }}
      onKeyDown={onKey}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Project showcase"
    >
      {/* ---- stage ---- */}
      <div
        className="relative flex items-center justify-center w-full overflow-visible h-[260px] sm:h-[300px] touch-pan-y cursor-grab active:cursor-grabbing"
        style={{ perspective: "1200px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          // Only end the drag if the pointer actually leaves while captured —
          // avoids treating a hover-out during a normal click as a release.
          if (draggingRef.current && e.buttons === 0) endDrag();
        }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="cursor-pointer"
            style={slideStyle(idx)}
            onClick={() => {
              if (dragMovedRef.current > DRAG_CLICK_THRESHOLD) {
                dragMovedRef.current = 0;
                return;
              }
              if (idx !== active) goTo(idx);
            }}
            aria-hidden={idx !== active}
          >
            <div className="relative overflow-hidden rounded-xl border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-[460px] h-[260px] sm:w-[520px] sm:h-[300px]">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-xl border-3 border-black bg-bg-panel text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-bg-raised cursor-pointer transition-all hover:-translate-x-0.5 active:scale-90"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-xl border-3 border-black bg-bg-panel text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-bg-raised cursor-pointer transition-all hover:translate-x-0.5 active:scale-90"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* ---- pagination dots ---- */}
      {/* Every dot keeps identical width/height at all times — only a scale
          transform and a crossfaded overlay change per dot. No dot is ever
          absolutely positioned relative to another, so there's nothing to
          misalign or bleed against.

          The highlight isn't toggled on `active` — it's driven by the same
          continuous `position` value the 3D stage animates with (already
          spring-eased, frame by frame). Each dot's proximity to `position`
          sets its own scale + overlay opacity, so as `position` glides from
          one index to another, the highlight visibly sweeps across the dots
          in between rather than jumping straight to the destination. */}
      {showPagination && total > 1 && (
        <div className="flex items-center gap-2 mt-1" role="tablist">
          {slides.map((_, idx) => {
            const proximity = Math.max(0, 1 - Math.abs(wrapOffset(idx, position, total)));
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                className="relative h-1.5 w-1.5 shrink-0 cursor-pointer rounded-full border border-black bg-border p-0 transition-colors duration-200 hover:bg-text-dim"
                style={{ transform: `scale(${1 + 0.25 * proximity})` }}
                role="tab"
                aria-selected={idx === active}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full bg-text-bright"
                  style={{ opacity: proximity }}
                />
              </button>
            );
          })}
        </div>
      )}


      {/* ---- caption block ---- */}
      {showCaption && current && (
        <div
          key={active}
          className="flex w-full max-w-xl flex-col items-center gap-3 overflow-hidden px-4 text-center h-[164px] sm:h-[184px] animate-[caption-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
        >
          <h3 className="truncate text-lg sm:text-xl font-bold text-text-bright tracking-tight">
            {current.title}
          </h3>

          <p className="max-w-lg mx-auto text-sm sm:text-base font-medium text-black dark:text-white leading-relaxed text-center opacity-90 line-clamp-2">
            {current.subtitle}
          </p>

          <div className="flex min-h-8 max-h-8 flex-wrap justify-center gap-2 overflow-hidden">
            {current.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-md border-3 border-black bg-bg-panel px-2.5 py-1 font-mono text-xs text-amber"
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

/*
Add once, globally (e.g. globals.css), for the caption's entrance pop:

@keyframes caption-in {
  from { opacity: 0; transform: translateY(6px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
*/
