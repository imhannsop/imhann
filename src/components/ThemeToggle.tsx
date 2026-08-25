"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * ThemeToggle — reads/writes `localStorage("theme")` and toggles
 * the `.dark` class on `<html>`. Light mode is the default; dark mode
 * only activates on explicit user action (never via prefers-color-scheme).
 *
 * FOUC prevention is handled by an inline <script> in layout.tsx that
 * runs before React hydrates, so the first paint is always correct.
 */
interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [{ mounted, dark }, setState] = useState(() => ({ mounted: false, dark: false }));

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ mounted: true, dark: isDark });
  }, []);

  const toggle = () => {
    const next = !dark;
    setState((s) => ({ ...s, dark: next }));
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // SSR / pre-mount: render placeholder to avoid layout shift
  if (!mounted) {
    return (
      <button
        className={
          className ??
          "flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-bg-panel text-text-bright shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        }
        aria-label="Toggle theme"
      >
        <span className="h-[18px] w-[18px]" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={
        className ??
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-black bg-bg-panel text-text-bright shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-bg-raised hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
      }
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
