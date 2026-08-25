"use client";

import { useEffect, useState } from "react";

// Watches the given section ids and reports which one is currently in view.
// Used by both the desktop crumbs and the mobile floating nav.
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const nav = document.querySelector("nav");
  const GAP = 25; // breathing room between navbar and section
  const navBottom = nav ? nav.getBoundingClientRect().bottom : 80;
  const top = el.getBoundingClientRect().top + window.scrollY - navBottom - GAP;

  window.scrollTo({ top, behavior: "smooth" });
}