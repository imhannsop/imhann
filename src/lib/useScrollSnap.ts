"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   SPRING-PHYSICS SCROLL-TO
   A drop-in replacement for `el.scrollIntoView({ behavior: "smooth" })` that
   uses a damped spring (slight overshoot) instead of the browser's fixed
   easing curve. Used by FloatingNav to scroll to a section when the user
   taps an item in the wheel menu.

   NOTE: this file intentionally does NOT include scroll-snap-on-scroll
   behavior (no listening to page scroll / auto-snapping between sections).
   It only exposes an imperative "scroll to this element" function.
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Spring config ───────────────────────────────────────────────────────────
const SPRING_STIFFNESS = 120; // pull strength
const SPRING_DAMPING = 18; // friction (lower = more bounce)
const SPRING_MASS = 1; // inertia
const SPRING_REST_THRESHOLD = 0.5; // px — stop animating when this close

/**
 * Public API: spring-scroll to a DOM element by ID.
 * Returns a cancel function, or undefined if the element doesn't exist / is
 * already in view. Drop-in replacement for el.scrollIntoView({ smooth }).
 */
export function springScrollToElement(id: string): (() => void) | undefined {
  const el = document.getElementById(id);
  if (!el) return;

  const scrollMt = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const targetY = el.getBoundingClientRect().top + window.scrollY - scrollMt;

  if (Math.abs(window.scrollY - targetY) < 2) return;

  return springScrollTo(targetY);
}

/** Animate window scroll from current position to `targetY` using spring physics. */
function springScrollTo(targetY: number): () => void {
  let currentY = window.scrollY;
  let velocity = 0;
  let rafId = 0;
  let lastTime = 0;

  const tick = (time: number) => {
    if (!lastTime) {
      lastTime = time;
      rafId = requestAnimationFrame(tick);
      return;
    }

    // Cap dt to avoid explosion after tab backgrounding
    const dt = Math.min((time - lastTime) / 1000, 0.064);
    lastTime = time;

    // Damped spring force:  F = -k(x - target) - d * v
    const displacement = currentY - targetY;
    const springForce = -SPRING_STIFFNESS * displacement;
    const dampingForce = -SPRING_DAMPING * velocity;
    const acceleration = (springForce + dampingForce) / SPRING_MASS;

    velocity += acceleration * dt;
    currentY += velocity * dt;

    window.scrollTo(0, currentY);

    // Rest check
    if (
      Math.abs(displacement) < SPRING_REST_THRESHOLD &&
      Math.abs(velocity) < SPRING_REST_THRESHOLD
    ) {
      window.scrollTo(0, targetY);
      return;
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  // Return a cancel function so callers can abort mid-flight
  return () => cancelAnimationFrame(rafId);
}
