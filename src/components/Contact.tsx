"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative scroll-mt-24 sm:scroll-mt-28 rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" id="contact">
      <div className="mb-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">contact</div>
      <div className="mb-6 text-sm sm:text-base text-text-dim">design only for now — no backend wired up yet.</div>
      <div className="flex max-w-2xl flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm tracking-[.04em] font-medium text-text-dim before:content-['$_'] before:text-green">
            name
          </label>
          <input
            type="text"
            placeholder="your name"
            className="w-full rounded-[3px] border border-border-dim bg-bg-raised px-4 py-3 text-base text-text-bright focus:border-purple focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm tracking-[.04em] font-medium text-text-dim before:content-['$_'] before:text-green">
            email
          </label>
          <input
            type="email"
            placeholder="you@email.com"
            className="w-full rounded-[3px] border border-border-dim bg-bg-raised px-4 py-3 text-base text-text-bright focus:border-purple focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm tracking-[.04em] font-medium text-text-dim before:content-['$_'] before:text-green">
            message
          </label>
          <textarea
            rows={5}
            placeholder="write your message..."
            className="w-full resize-y rounded-[3px] border border-border-dim bg-bg-raised px-4 py-3 text-base text-text-bright focus:border-purple focus:outline-none transition-colors"
          />
        </div>
        <button
          className="self-start cursor-pointer rounded-[3px] border border-border bg-bg-raised px-6 py-3 text-base font-medium text-text-bright transition-colors duration-150 hover:border-green hover:text-green"
          onClick={() => setSent(true)}
        >
          send message
        </button>
        {sent && (
          <div className="min-h-4 text-sm sm:text-base text-green">
            queued — no backend connected yet (design preview only)
          </div>
        )}
      </div>
    </div>
  );
}