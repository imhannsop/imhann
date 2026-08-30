// Shared animation constants used across modal components (Hero, Certs).
// Kept in one place so timing feels consistent site-wide.

export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export const LAYOUT_TRANSITION = {
  type: "tween" as const,
  duration: 0.38,
  ease: EASE_SMOOTH,
};

export const CHROME_TRANSITION = {
  type: "tween" as const,
  duration: 0.22,
  ease: EASE_SMOOTH,
};

export const MORPH_TRANSITION = {
  layout: LAYOUT_TRANSITION,
  default: CHROME_TRANSITION,
};
