"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative scroll-mt-5 rounded-[3px] border border-border bg-bg-panel px-6 py-6" id="contact">
      <div className="mb-4 text-xs tracking-[.12em] text-text-dim uppercase">contact</div>
      <div className="mb-4 text-sm text-text-dim">design only for now — no backend wired up yet.</div>
      <div className="flex max-w-[520px] flex-col gap-4">
        <div>
          <label className="mb-2 block text-xs tracking-[.04em] text-text-dim before:content-['$_'] before:text-green">
            name
          </label>
          <input
            type="text"
            placeholder="your name"
            className="w-full resize-y rounded-[3px] border border-border-dim bg-bg-raised px-3.5 py-2.5 text-sm text-text-bright focus:border-purple focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs tracking-[.04em] text-text-dim before:content-['$_'] before:text-green">
            email
          </label>
          <input
            type="email"
            placeholder="you@email.com"
            className="w-full resize-y rounded-[3px] border border-border-dim bg-bg-raised px-3.5 py-2.5 text-sm text-text-bright focus:border-purple focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs tracking-[.04em] text-text-dim before:content-['$_'] before:text-green">
            message
          </label>
          <textarea
            rows={4}
            placeholder="write your message..."
            className="w-full resize-y rounded-[3px] border border-border-dim bg-bg-raised px-3.5 py-2.5 text-sm text-text-bright focus:border-purple focus:outline-none"
          />
        </div>
        <button
          className="self-start cursor-pointer rounded-[3px] border border-border bg-bg-raised px-5 py-2.5 text-sm text-text-bright transition-colors duration-150 hover:border-green hover:text-green"
          onClick={() => setSent(true)}
        >
          send message
        </button>
        {sent && (
          <div className="min-h-4 text-sm text-green">
            queued — no backend connected yet (design preview only)
          </div>
        )}
      </div>
    </div>
  );
}