"use client";

import { useEffect, useState } from "react";
import { stats } from "@/lib/data";
import Image from "next/image";
import profileImg from "@/assets/profile.jpg";
import About from "./About";
import GitHubCalendar from "./GitHubCalendar";

const BLURB = "Building distinct web applications and tweaking Linux systems from the terminal up. Driven by OS-level control, workflow automation, and fast, functional user interfaces.";

const FASTFETCH_LOGO = `      /\\
     /  \\
    /\\   \\
   /      \\
  /   ,,   \\
 /   |  |  -\\
/_-''    ''-_\\`;

export default function Hero() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(BLURB.slice(0, i));
      if (i >= BLURB.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
      {/* Top Left Card: Hero (50% width / 6 spans) */}
      <div
        className="lg:col-span-6 relative flex flex-col justify-between h-full rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scroll-mt-24 sm:scroll-mt-28"
        id="home"
      >
        <div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 flex-none items-center justify-center rounded-full overflow-hidden border-3 border-black bg-gradient-to-br from-purple to-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[24px] font-extrabold">
              <Image
                src={profileImg}
                alt="Logo"
                width={140}
                height={140}
                className="object-cover grayscale transition-all duration-200 group-hover:grayscale-0"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-bright">Sop</h1>
              <div className="mt-1 text-base font-medium text-purple">Hobbyist Dev</div>
            </div>
          </div>
          <p className="mt-5 min-h-[3.6em] sm:min-h-[3.2em] w-full text-sm sm:text-base leading-[1.65] text-text">
            {typed}
            <span className="inline-block h-[1em] w-2 ml-0.5 animate-blink bg-green align-bottom" />
          </p>
        </div>
        <p className="mt-4 text-[#82181A]">
          Note: This website is still WIP - expect bugs :)
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://github.com/imhannsop"
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer rounded-xl border-3 border-black bg-bg-panel px-4 py-2 text-sm font-medium text-text-bright no-underline shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-bg-raised hover:text-purple hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            GitHub ↗
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer rounded-xl border-3 border-black bg-bg-panel px-4 py-2 text-sm font-medium text-text-bright no-underline shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-bg-raised hover:text-purple hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Resume ↗
          </a>
        </div>
      </div>

      {/* Top Right Card: About Me (50% width / 6 spans, matched height) */}
      <div className="lg:col-span-6 h-full">
        <About />
      </div>

      {/* Bottom Left Card: GitHub Activity Graph (7 spans for wide heatmap) */}
      <div className="lg:col-span-7 h-full">
        <GitHubCalendar />
      </div>

      {/* Bottom Right Card: Fastfetch (Remaining 5 spans, matches About Me height) */}
      <div className="lg:col-span-5 relative flex flex-col justify-center h-full rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 font-[family-name:var(--font-jbmono)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="absolute -top-[9px] left-4 bg-bg px-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
          fastfetch
        </div>
        <div className="flex items-center gap-10 sm:gap-14 my-auto">
          <pre className="font-mono text-[11px] sm:text-xs md:text-sm lg:text-base font-extrabold leading-[1.2] text-text-bright select-none flex-none">
            {FASTFETCH_LOGO}
          </pre>
          <div className="flex flex-col gap-2.5 min-w-0">
            <div className="flex flex-col gap-2.5 whitespace-pre text-xs sm:text-sm lg:text-base leading-[1.25] font-[family-name:var(--font-jbmono)]">
              {stats.map((s) => (
                <div className="flex items-center gap-3.5 sm:gap-4" key={s.label}>
                  <span className="min-w-[70px] sm:min-w-[80px] flex-none font-extrabold text-text-bright">
                    {s.label}:
                  </span>
                  <span className="text-text-bright font-medium">{s.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <span className="min-w-[70px] sm:min-w-[80px] flex-none font-extrabold text-text-bright">
                  Status:
                </span>
                <span className="inline-flex items-center gap-2 text-text-bright font-bold">
                  <span className="h-2.5 w-2.5 flex-none animate-pulse rounded-full bg-purple shadow-[0_0_6px_var(--color-purple)]" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}