"use client";

import { useState, useEffect } from "react";
import { certs, type Cert } from "@/lib/data";

export default function Certs() {
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    if (selectedCert) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedCert]);

  return (
    <>
      {/* =========================================================
          FULL-WIDTH CERTIFICATIONS CONTAINER
         ========================================================= */}
      <section
        id="certs"
        className="relative w-full scroll-mt-24 sm:scroll-mt-28 rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Section Tag */}
        <div className="mb-6 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
          certifications & achievements
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {certs.map((c, i) => (
            <div
              key={i}
              className="flex flex-col justify-between gap-4 rounded-xl border-3 border-black bg-bg-panel p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex flex-col gap-4">
                {/* Certificate Image Thumbnail */}
                <div
                  onClick={() => setSelectedCert(c)}
                  className="cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${c.name} certificate`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedCert(c);
                    }
                  }}
                >
                  {c.image ? (
                    <div className="relative w-full overflow-hidden rounded-lg border-2 border-black bg-white dark:bg-bg-raised aspect-[4/3] flex items-center justify-center p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={typeof c.image === "string" ? c.image : c.image.src}
                        alt={`${c.name} certificate`}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-[repeating-linear-gradient(45deg,var(--color-bg-raised)_0_8px,var(--color-bg-panel)_8px_16px)] text-xs sm:text-sm font-semibold tracking-[.08em] text-text-dim uppercase transition-colors group-hover:border-purple">
                      certificate
                    </div>
                  )}
                </div>

                {/* Certificate Meta & Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-text-bright leading-snug">
                    {c.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-text-dim mt-1.5 font-medium">
                    <span>{c.issuer}</span>
                    <span>{c.year}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border-dim mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCert(c)}
                  className="cursor-pointer text-sm font-semibold text-text-bright transition-colors hover:text-purple"
                >
                  view ↗
                </button>
                {c.url && c.url !== "#" && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-text-dim transition-colors hover:text-text-bright"
                  >
                    verify ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          CERTIFICATE PREVIEW MODAL DIALOG
         ========================================================= */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(10,10,14,0.85)] backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCert(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedCert.name}
        >
          <div className="relative w-full max-w-[800px] rounded-xl border-3 border-black bg-bg-panel p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[92vh] flex flex-col justify-between">
            {/* Top Close Button (Neo-brutalist Floating Pin) */}
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              className="absolute -top-[44px] right-0 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-[4px] border-2 border-black bg-bg-panel text-xl font-bold text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105 active:translate-y-[2px]"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-dim pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-text-bright tracking-tight">
                  {selectedCert.name}
                </h2>
                <div className="mt-1 flex items-center gap-3 text-xs sm:text-sm text-text-dim">
                  <span className="font-semibold text-text">{selectedCert.issuer}</span>
                  <span>•</span>
                  <span>{selectedCert.year}</span>
                </div>
              </div>

              {selectedCert.url && selectedCert.url !== "#" && (
                <a
                  href={selectedCert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer rounded-lg border-2 border-black bg-bg px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-text-bright shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-bg-raised hover:text-purple active:translate-y-[1px]"
                >
                  Verify Certificate ↗
                </a>
              )}
            </div>

            {/* Modal Body / Image Showcase */}
            <div className="my-5 flex items-center justify-center overflow-hidden rounded-lg border-2 border-black bg-white dark:bg-bg-raised p-3 min-h-[260px] max-h-[65vh]">
              {selectedCert.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={
                    typeof selectedCert.image === "string"
                      ? selectedCert.image
                      : selectedCert.image.src
                  }
                  alt={selectedCert.name}
                  className="max-h-[60vh] w-auto max-w-full object-contain rounded"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-text-dim">
                  <div className="text-4xl mb-2">📜</div>
                  <div className="font-bold text-text-bright text-base">
                    No image preview attached
                  </div>
                  <div className="text-xs text-text-dim mt-1">
                    Add an `image` path in src/lib/data.ts to view it here.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}