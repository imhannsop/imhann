"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { certs, type Cert } from "@/lib/data";

export default function Certs() {
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? certs : certs.slice(0, 2);

  // Escape to close modal and lock body scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    if (selectedCert) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
    };
  }, [selectedCert]);

  return (
    <section
      id="certs"
      className="relative w-full scroll-mt-24 sm:scroll-mt-28 rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="mb-6 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
        certifications & achievements
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {visible.map((c) => (
          <CertCard
            key={c.name}
            cert={c}
            isOpen={selectedCert?.name === c.name}
            onOpen={() => setSelectedCert(c)}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setShowAll((s) => !s)}
          className="inline-flex items-center gap-2 rounded-md border border-border-dim bg-bg-panel px-4 py-2 text-sm font-medium text-text hover:shadow-md transition"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <Modal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function CertCard({
  cert,
  isOpen,
  onOpen,
}: {
  cert: Cert;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw pointer position within the card, normalized -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Smooth the raw values so the tilt settles instead of snapping
  const springConfig = { stiffness: 260, damping: 20, mass: 0.4 };
  const sx = useSpring(px, springConfig);
  const sy = useSpring(py, springConfig);

  // Tilt: moving the mouse toward the top tilts the card "away" at the top
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  // Subtle glare that follows the cursor
  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    px.set((e.clientX - bounds.left) / bounds.width - 0.5);
    py.set((e.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handleMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full cursor-pointer [perspective:1000px]"
    >
      {/* This is the element that shares layoutId with the modal.
          Hiding it while open (rather than unmounting) lets Framer Motion
          animate the *same* element from its grid position into the modal. */}
      <motion.div
        layoutId={`cert-card-${cert.name}`}
        layout
        style={{
          rotateX: isOpen ? 0 : rotateX,
          rotateY: isOpen ? 0 : rotateY,
          transformStyle: "preserve-3d",
          opacity: isOpen ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="rounded-lg overflow-hidden border-2 border-black bg-white"
      >
        {cert.image ? (
          // aspect-[7/5] mirrors a standard landscape certificate sheet so the
          // full document shows uncropped instead of being squeezed into a fixed box
          <div className="relative aspect-[7/5] w-full bg-white">
            <Image
              src={cert.image}
              alt={cert.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-2"
            />
            {/* cursor-tracking glare */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([gx, gy]) =>
                    `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 55%)`
                ),
              }}
            />
          </div>
        ) : (
          <div className="flex aspect-[7/5] items-center justify-center text-sm text-text-dim">
            No preview
          </div>
        )}

        <div className="px-4 py-3 bg-bg-panel text-text">
          <h3 className="text-sm font-bold leading-tight">{cert.name}</h3>
          <p className="mt-1 text-xs text-text-dim">
            {cert.issuer} • {cert.year}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Modal({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Same layoutId as the grid card: Framer Motion animates this
          element seamlessly from the card's screen position/size into
          this centered, larger layout. */}
      <motion.div
        layoutId={`cert-card-${cert.name}`}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-4xl rounded-lg bg-bg-panel border-2 border-black shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={cert.name}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/2">
            <div className="relative aspect-[7/5] w-full bg-bg-raised">
              {cert.image ? (
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-2"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-text-dim">
                  No image
                </div>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="w-full sm:w-1/2 flex flex-col p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-extrabold">{cert.name}</h3>
                <p className="mt-1 text-sm text-text-dim">
                  {cert.issuer} • {cert.year}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-4 rounded px-2 py-1 text-sm font-medium text-text-dim hover:text-text"
              >
                ✕
              </button>
            </div>

            {cert.summary && (
              <p className="mt-4 text-sm text-text">{cert.summary}</p>
            )}

            {cert.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {cert.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-bg px-3 py-1 text-sm font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <a
                href={cert.url || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-green px-4 py-2 text-sm font-semibold text-white shadow"
              >
                Verify Credential
              </a>

              <button
                onClick={onClose}
                className="ml-auto rounded-md px-4 py-2 text-sm font-medium border border-border-dim bg-bg hover:shadow"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
