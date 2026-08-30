"use client";

import { useState } from "react";
import { Mail, Quote } from "lucide-react";

// lucide-react deprecated/removed brand-logo icons (Github, Linkedin, etc.),
// so these two are small inline SVGs instead.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.68H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Go to GitHub",
    href: "https://github.com/imhannsop",
    icon: GithubIcon,
  },
  {
    label: "Go to LinkedIn",
    href: "https://linkedin.com/in/imhannsop",
    icon: LinkedinIcon,
  },
  {
    label: "Send an email",
    href: "mailto:imhannsop@gmail.com",
    icon: Mail,
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div
      className="relative scroll-mt-3 md:scroll-mt-20 rounded-xl border-3 border-black bg-bg-panel shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      id="contact"
    >
      <div className="absolute -top-[9px] left-4 bg-bg px-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
        contact
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Quote + Social Links */}
        <div className="flex flex-col justify-between gap-8 p-8 pt-10 max-sm:p-6 max-sm:pt-8 md:border-r-3 border-b-3 md:border-b-0 border-black">
          <div className="flex flex-col gap-4">
            <Quote className="h-7 w-7 text-purple" strokeWidth={2.5} fill="currentColor" />
            <p className="text-xl sm:text-4xl font-medium italic leading-snug text-text-bright">
              &ldquo;Perfection is achieved when there is nothing left to remove.&rdquo;
            </p>
            <span className="sm:pt-15 text-right text-sm font-medium text-text-dim">— Antoine de Saint-Exupéry</span>
          </div>

          <div className="flex flex-row items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="group flex h-12 w-12 flex-none items-center justify-center rounded-xl border-3 border-black bg-bg-raised text-text-bright no-underline shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:text-purple hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                <Icon className="h-5 w-5" strokeWidth={2.25} />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex flex-col gap-5 p-8 pt-6 max-sm:p-6 max-sm:pt-6">
          <div>
            <label className="mb-2 block text-sm tracking-[.04em] font-medium text-text-dim before:content-['$_'] before:text-green">
              name
            </label>
            <input
              type="text"
              placeholder="your name"
              className="w-full rounded-xl border-3 border-black bg-bg-raised px-4 py-3 text-base text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all focus:-translate-y-0.5 focus:text-purple focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm tracking-[.04em] font-medium text-text-dim before:content-['$_'] before:text-green">
              email
            </label>
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-xl border-3 border-black bg-bg-raised px-4 py-3 text-base text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all focus:-translate-y-0.5 focus:text-purple focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm tracking-[.04em] font-medium text-text-dim before:content-['$_'] before:text-green">
              message
            </label>
            <textarea
              rows={4}
              placeholder="write your message..."
              className="w-full resize-y rounded-xl border-3 border-black bg-bg-raised px-4 py-3 text-base text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all focus:-translate-y-0.5 focus:text-purple focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            />
          </div>
          <button
            className="self-start cursor-pointer rounded-xl border-3 border-black bg-bg-raised px-6 py-3 text-base font-medium text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:text-purple hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
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
    </div>
  );
}
