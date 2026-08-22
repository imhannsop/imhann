"use client";

import { useEffect, useState } from "react";
import { crumbLinks } from "@/lib/data";
import { scrollToSection, useActiveSection } from "@/lib/useActiveSection";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(["home", ...crumbLinks]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 z-50 hidden w-full border-b border-border bg-bg-panel backdrop-blur transition-shadow duration-200 sm:block ${
        scrolled ? "shadow-[0_10px_26px_rgba(0,0,0,.45)]" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-2 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-text-bright">
          imhannsop
        </div>
        <div className="flex flex-wrap gap-0.5 text-text-dim">
          {crumbLinks.map((id) => (
            <button
              key={id}
              className={`cursor-pointer rounded-sm px-2.5 py-1.5 text-sm hover:bg-bg-raised hover:text-purple ${
                active === id ? "text-green" : ""
              }`}
              onClick={() => scrollToSection(id)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}