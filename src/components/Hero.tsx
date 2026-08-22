"use client";

import { useEffect, useState } from "react";
import { stats } from "@/lib/data";

const BLURB = "I write code, build full-stack web tools, and dive into problem-solving.";

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
    <div className="flex flex-wrap items-stretch gap-3.5" id="home">
      <div className="relative min-w-0 flex-[1_1_320px] rounded-[3px] border border-border bg-bg-panel px-5 pt-[22px] pb-5 max-sm:basis-full">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex h-16 w-16 flex-none items-center justify-center rounded-full border-2 border-dashed border-border bg-gradient-to-br from-purple to-blue text-[19px] font-extrabold text-bg">
            EK<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-bg-panel px-1 text-[8px] tracking-[.04em] whitespace-nowrap text-text-dim">placeholder</span>
          </div>
          <div>
            <h1 className="text-[22px] font-extrabold tracking-[-.01em] text-text-bright">Sop</h1>
            <div className="mt-0.5 text-[13px] text-purple">CS @ USA · Competitive Prog & Web Dev</div>
          </div>
        </div>
        <p className="mt-4 min-h-[2.6em] max-w-[44ch] leading-[1.65] text-text">
          {typed}
          <span className="inline-block h-[1em] w-2 animate-blink bg-green align-bottom" />
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-[3px] border border-border px-3 py-1.5 text-[12.5px] text-text-bright no-underline transition-colors duration-150 hover:border-purple hover:bg-bg-raised hover:text-purple"
          >
            GitHub ↗
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-[3px] border border-border px-3 py-1.5 text-[12.5px] text-text-bright no-underline transition-colors duration-150 hover:border-purple hover:bg-bg-raised hover:text-purple"
          >
            Resume ↗
          </a>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-[0_0_220px] flex-col justify-center gap-2.5 rounded-[3px] border border-border bg-bg-panel px-[18px] pt-5 pb-4 max-sm:basis-full">
        <div className="absolute -top-[9px] left-3.5 bg-bg px-2 text-[11px] tracking-[.12em] text-text-dim uppercase">fastfetch</div>
        <div className="flex items-center gap-[7px]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[15px] w-[15px] flex-none fill-cyan">
            <path d="M12 3 4.5 20h5.2L12 13.5 14.3 20h5.2z" />
          </svg>
          <span className="text-[11px] font-bold tracking-[.01em] text-text-bright">ekoubu@yoi</span>
        </div>
        <div className="flex flex-col gap-1 text-[11px] leading-[1.15] whitespace-pre">
          {stats.map((s) => (
            <div className="flex gap-1.5" key={s.label}>
              <span className="min-w-[38px] flex-none text-[10px] font-bold text-cyan">{s.label}</span>
              <span className="text-[10.5px] text-text">{s.value}</span>
            </div>
          ))}
          <div className="flex gap-1.5">
            <span className="min-w-[38px] flex-none text-[10px] font-bold text-cyan">Status</span>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] text-emerald">
              <span className="h-[5px] w-[5px] flex-none animate-pulse rounded-full bg-emerald shadow-[0_0_5px_var(--color-emerald)]" />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}