"use client";

import { useState } from "react";
import { books } from "@/lib/data";

export default function Blogs() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);

  const open = (idx: number) => {
    setOpenIdx(idx);
    setTimeout(() => setFlipped(true), 120);
  };
  const close = () => {
    setFlipped(false);
    setTimeout(() => setOpenIdx(null), 300);
  };

  const book = openIdx !== null ? books[openIdx] : null;

  return (
    <>
      <div className="relative scroll-mt-24 sm:scroll-mt-28 rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" id="blogs">
        <div className="mb-6 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">blogs — the library</div>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-min items-end gap-4 border-b-[8px] border-border-dim px-2 pb-6 pt-4">
            {books.map((b, i) => (
              <div
                className={`relative h-[220px] w-[68px] sm:h-[240px] sm:w-[76px] flex-none cursor-pointer rounded-[4px_4px_2px_2px] shadow-[inset_-3px_0_6px_rgba(0,0,0,.25),0_4px_10px_rgba(0,0,0,.35)] transition-transform duration-150 hover:-translate-y-2.5 ${
                  b.color === "c1"
                    ? "bg-gradient-to-b from-[#c7b0fb] to-[#a583f9]"
                    : b.color === "c2"
                    ? "bg-gradient-to-b from-[#a9e6a6] to-[#7fce7b]"
                    : b.color === "c3"
                    ? "bg-gradient-to-b from-[#9fc0fb] to-[#6f9bf6]"
                    : "bg-gradient-to-b from-[#f0cf8e] to-[#e0af5e]"
                }`}
                key={b.title}
                onClick={() => open(i)}
              >
                <span className="absolute bottom-4 left-1/2 max-h-[170px] sm:max-h-[190px] -translate-x-1/2 overflow-hidden text-sm sm:text-[15px] font-bold tracking-[.02em] text-black/60 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                  {b.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openIdx !== null && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(10,10,14,.8)] backdrop-blur-[4px] transition-opacity duration-[250ms] ${
            flipped ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="[perspective:1600px]">
            <div className="relative h-[480px] w-[320px] sm:h-[520px] sm:w-[400px] [transform-style:preserve-3d]">
              <button
                className="absolute -top-[44px] right-0 flex h-[36px] w-[36px] items-center justify-center cursor-pointer rounded-[3px] border border-border bg-bg-panel text-lg text-text-dim hover:border-purple hover:text-text-bright"
                onClick={close}
              >
                ×
              </button>
              <div className="absolute inset-0 overflow-hidden rounded-[2px_6px_6px_2px] bg-paper p-8 text-paper-ink shadow-[0_20px_50px_rgba(0,0,0,.6)]">
                <h4 className="mb-2 font-serif text-2xl sm:text-3xl font-bold leading-tight">{book!.title}</h4>
                <div className="mb-4 text-xs sm:text-sm tracking-[.04em] text-[#7a6a4a]">{book!.meta}</div>
                <p className="font-serif text-base sm:text-lg italic leading-[1.75] text-[#4a3f2b]">{book!.excerpt}</p>
              </div>
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-[2px_6px_6px_2px] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,.6),inset_6px_0_14px_rgba(0,0,0,.25)] transition-transform duration-700 [transition-timing-function:cubic-bezier(.6,.05,.2,1)] [backface-visibility:hidden] [transform-origin:left_center] ${
                  flipped ? "[transform:rotateY(-155deg)]" : "[transform:rotateY(0deg)]"
                } ${
                  book!.color === "c1"
                    ? "bg-gradient-to-b from-[#c7b0fb] to-[#a583f9]"
                    : book!.color === "c2"
                    ? "bg-gradient-to-b from-[#a9e6a6] to-[#7fce7b]"
                    : book!.color === "c3"
                    ? "bg-gradient-to-b from-[#9fc0fb] to-[#6f9bf6]"
                    : "bg-gradient-to-b from-[#f0cf8e] to-[#e0af5e]"
                }`}
              >
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-black/75">{book!.title}</div>
                  <div className="mt-3 text-xs sm:text-sm tracking-[.1em] text-black/55 uppercase font-medium">tap to open</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}