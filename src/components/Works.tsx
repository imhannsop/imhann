"use client";

import { useState } from "react";
import { projects } from "@/lib/data";

export default function Works() {
  const [openFile, setOpenFile] = useState<string | null>(null);

  return (
    <div className="relative scroll-mt-5 rounded-[3px] border border-border bg-bg-panel px-6 py-6" id="works">
      <div className="mb-4 text-xs tracking-[.12em] text-text-dim uppercase">
        selected works — click to inspect, or run {`cat <file>`} below
      </div>

      {projects.map((p) => {
        const isOpen = openFile === p.file;
        return (
          <div
            className="mb-3 cursor-pointer overflow-hidden rounded-[3px] border border-border-dim last:mb-0"
            key={p.file}
            data-file={p.file}
          >
            <div
              className="flex items-center justify-between px-4 py-3.5 transition-colors duration-150 hover:bg-bg-raised"
              onClick={() => setOpenFile(isOpen ? null : p.file)}
            >
              <div className="text-base font-bold text-text-bright">
                <span className="font-normal text-text-dim">{p.idx}</span> {p.name}
              </div>
              <div className="text-sm text-text-dim">{isOpen ? "cat ▴" : "cat ▾"}</div>
            </div>
            <div className="px-4 pb-3.5 text-sm text-text-dim">{p.desc}</div>
            <div className="flex flex-wrap gap-2 px-4 pb-3.5">
              {p.tags.map((t) => (
                <span
                  className="rounded-[3px] border border-border-dim px-2 py-1 text-xs text-amber"
                  key={t}
                >
                  {t}
                </span>
              ))}
            </div>
            <div
              className={`overflow-hidden border-t border-border-dim transition-[max-height] duration-200 ease-out ${
                isOpen ? "max-h-[200px]" : "max-h-0"
              }`}
            >
              <div className="px-4 py-3.5 text-sm leading-[1.6] text-text">
                <div className="text-green before:content-['$_'] before:text-text-dim">cat {p.file}</div>
                {p.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}