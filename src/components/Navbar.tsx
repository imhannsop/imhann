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
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="topbar">
        <div className="site">
          ekoubuyoi<span className="dot">.</span>dev
        </div>
        <div className="crumbs">
          {crumbLinks.map((id) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
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
