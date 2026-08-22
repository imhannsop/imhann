"use client";

import { useEffect, useState } from "react";
import { stats } from "@/lib/data";

import Image from "next/image";

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
    <div className="flex flex-wrap items-stretch gap-4" id="home">
      <div className="relative min-w-0 flex-[1_1_320px] rounded-[3px] border border-border bg-bg-panel px-6 pt-6 pb-6 max-sm:basis-full">
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative flex h-20 w-20 flex-none items-center justify-center rounded-full overflow-hidden border-2 border-dashed border-border bg-gradient-to-br from-purple to-blue text-[22px] font-extrabold">
            <Image
              src="/images/profile.jpg"
              alt="Logo"
              fill
              sizes="(max-width: 640px) 96px, 120px"
              className="object-cover grayscale transition-all duration-200 group-hover:grayscale-0"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-[-.01em] text-text-bright">Sop</h1>
            <div className="mt-1 text-base text-purple"> Hobbyist Dev </div>
          </div>
        </div>
        <p className="mt-5 min-h-[2.6em] max-w-[44ch] text-base leading-[1.65] text-text">
          {typed}
          <span className="inline-block h-[1em] w-2 animate-blink bg-green align-bottom" />
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-[3px] border border-border px-4 py-2 text-sm text-text-bright no-underline transition-colors duration-150 hover:border-purple hover:bg-bg-raised hover:text-purple"
          >
            GitHub ↗
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-[3px] border border-border px-4 py-2 text-sm text-text-bright no-underline transition-colors duration-150 hover:border-purple hover:bg-bg-raised hover:text-purple"
          >
            Resume ↗
          </a>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-[0_0_240px] flex-col justify-center gap-3 rounded-[3px] border border-border bg-bg-panel px-5 pt-6 pb-5 max-sm:basis-full">
        <div className="absolute -top-[9px] left-3.5 bg-bg px-2 text-xs tracking-[.12em] text-text-dim uppercase">fastfetch</div>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] flex-none fill-cyan">
            <path d="M12 3 4.5 20h5.2L12 13.5 14.3 20h5.2z" />
          </svg>
          <span className="text-sm font-bold tracking-[.01em] text-text-bright">ekoubu@yoi</span>
        </div>
        <div className="flex flex-col gap-1.5 text-sm leading-[1.15] whitespace-pre">
          {stats.map((s) => (
            <div className="flex gap-2" key={s.label}>
              <span className="min-w-[42px] flex-none text-xs font-bold text-cyan">{s.label}</span>
              <span className="text-[13px] text-text">{s.value}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <span className="min-w-[42px] flex-none text-xs font-bold text-cyan">Status</span>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-emerald">
              <span className="h-[6px] w-[6px] flex-none animate-pulse rounded-full bg-emerald shadow-[0_0_5px_var(--color-emerald)]" />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}