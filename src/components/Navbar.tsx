"use client";

import { useEffect, useState } from "react";
import { crumbLinks } from "@/lib/data";
import { scrollToSection, useActiveSection } from "@/lib/useActiveSection";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(["home", ...crumbLinks.map((item) => item.id)]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-4 sm:top-6 z-50 hidden w-full rounded-xl border-3 border-black bg-[var(--color-bg-panel)]/90 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:block ${scrolled ? "bg-[var(--color-bg-panel)]/95" : ""
        }`}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-3 px-6 py-3.5 sm:px-7 sm:py-4">
        {/* Home link */}
        <a
          href="/"
          className="cursor-pointer text-xl font-bold tracking-tight text-text-bright transition-colors hover:text-purple"
        >
          imhannsop
        </a>
        <div className="flex items-center gap-2">
          {crumbLinks.map(({ id, value, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                aria-label={`Jump to ${value} section`}
                className={`cursor-pointer px-3 py-1.5 text-sm sm:text-base transition-all duration-150 ${isActive ? "font-bold text-text-bright underline underline-offset-8 decoration-2 decoration-purple" : "font-medium text-text hover:text-text-bright"}`}
                onClick={() => scrollToSection(id)}
              >
                {label}
              </button>
            );
          })}
          {/* Theme toggle sits right after "contact" */}
          <div className="ml-1.5 border-l border-border pl-2.5">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}