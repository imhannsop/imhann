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
      <div className="relative scroll-mt-5 rounded-[3px] border border-border bg-bg-panel px-6 py-6" id="blogs">
        <div className="mb-4 text-xs tracking-[.12em] text-text-dim uppercase">blogs — the library</div>
        <div className="overflow-x-auto pb-1.5">
          <div className="flex min-w-min items-end gap-3 border-b-[6px] border-border-dim px-1 pb-[22px] pt-4">
            {books.map((b, i) => (
              <div
                className={`relative h-[180px] w-[56px] flex-none cursor-pointer rounded-[3px_3px_2px_2px] shadow-[inset_-3px_0_6px_rgba(0,0,0,.25),0_3px_6px_rgba(0,0,0,.3)] transition-transform duration-150 hover:-translate-y-1.5 ${
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
                <span className="absolute bottom-3 left-1/2 max-h-[140px] -translate-x-1/2 overflow-hidden text-[13px] font-bold tracking-[.02em] text-black/55 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                  {b.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openIdx !== null && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(10,10,14,.75)] backdrop-blur-[3px] transition-opacity duration-[250ms] ${
            flipped ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="[perspective:1600px]">
            <div className="relative h-[440px] w-[340px] [transform-style:preserve-3d]">
              <button
                className="absolute -top-[38px] right-0 h-[30px] w-[30px] cursor-pointer rounded-[3px] border border-border bg-transparent text-base text-text-dim hover:border-purple hover:text-text-bright"
                onClick={close}
              >
                ×
              </button>
              <div className="absolute inset-0 overflow-hidden rounded-[2px_6px_6px_2px] bg-paper p-7 text-paper-ink shadow-[0_20px_50px_rgba(0,0,0,.5)]">
                <h4 className="mb-1.5 font-serif text-2xl">{book!.title}</h4>
                <div className="mb-4 text-xs tracking-[.04em] text-[#7a6a4a]">{book!.meta}</div>
                <p className="font-serif text-sm italic leading-[1.7] text-[#4a3f2b]">{book!.excerpt}</p>
              </div>
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-[2px_6px_6px_2px] p-7 text-center shadow-[0_20px_50px_rgba(0,0,0,.5),inset_6px_0_14px_rgba(0,0,0,.25)] transition-transform duration-700 [transition-timing-function:cubic-bezier(.6,.05,.2,1)] [backface-visibility:hidden] [transform-origin:left_center] ${
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
                  <div className="font-serif text-2xl font-semibold text-black/72">{book!.title}</div>
                  <div className="mt-2.5 text-xs tracking-[.08em] text-black/50 uppercase">tap to open</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}