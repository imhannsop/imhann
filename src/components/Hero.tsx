"use client";

import Image from "next/image";
import profileImg from "@/assets/profile.jpg";
import About from "./About";
import GitHubCalendar from "./GitHubCalendar";

const BLURB = "I build fast web tools and break my Linux setup for fun — usually in that order.";

export default function Hero() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
      {/* Top Left Card: Hero (5 spans) */}
      <div
        className="lg:col-span-5 relative flex flex-col h-full rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scroll-mt-24 sm:scroll-mt-28"
        id="home"
      >
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

        <p className="mt-6 text-sm sm:text-base leading-[1.65] text-text">
          {BLURB}
        </p>

        <p className="mt-3 text-[#82181a] sm:text-base text-sm">
          Still a work in progress — some things may break.
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

      {/* Top Right Card: GitHub Activity Graph (7 spans) */}
      <div className="lg:col-span-7 h-full">
        <GitHubCalendar />
      </div>

      {/* Bottom Card: About Me (12 spans for full width) */}
      <div className="lg:col-span-12 h-full">
        <About />
      </div>
    </div>
  );
}