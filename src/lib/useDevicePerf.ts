"use client";

import { useSyncExternalStore } from "react";

// Snapshot is computed once and never changes (hardware doesn't change mid-session).
// The media query listener handles the only dynamic part (prefers-reduced-motion).

interface DevicePerf {
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
}

const mql =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

function getSnapshot(): DevicePerf {
  if (typeof navigator === "undefined") {
    return { isLowEnd: false, prefersReducedMotion: false };
  }

  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
  const isLowEnd = cores <= 4 || mem <= 4;
  const prefersReducedMotion = mql?.matches ?? false;

  return { isLowEnd, prefersReducedMotion };
}

// SSR fallback — assume capable device, no reduced motion.
// Must be a stable reference: useSyncExternalStore compares snapshots with
// Object.is, so returning a fresh object literal on every call causes an
// infinite render loop.
const SERVER_SNAPSHOT: DevicePerf = { isLowEnd: false, prefersReducedMotion: false };

function getServerSnapshot(): DevicePerf {
  return SERVER_SNAPSHOT;
}

// Cache the last snapshot so useSyncExternalStore sees referential equality
// when nothing changed (avoids unnecessary re-renders).
let cached = getSnapshot();

function subscribe(onStoreChange: () => void): () => void {
  const handler = () => {
    cached = getSnapshot();
    onStoreChange();
  };
  mql?.addEventListener("change", handler);
  return () => mql?.removeEventListener("change", handler);
}

function getSnapshotCached(): DevicePerf {
  return cached;
}

/**
 * Returns device capability info for gating expensive effects.
 *
 * - `isLowEnd` — true when hardware concurrency ≤ 4 or device memory ≤ 4 GB
 * - `prefersReducedMotion` — mirrors the `prefers-reduced-motion: reduce` media query (live)
 */
export function useDevicePerf(): DevicePerf {
  return useSyncExternalStore(subscribe, getSnapshotCached, getServerSnapshot);
}
