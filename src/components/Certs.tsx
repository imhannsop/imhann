"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Award, ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { certs, type Cert } from "@/lib/data";

const ALL_CATEGORY = "All";
const CERT_CATEGORIES = ["Events", "Certifications"];

export default function Certs() {
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [category, setCategory] = useState<string>(ALL_CATEGORY);

  const categories = useMemo(() => [ALL_CATEGORY, ...CERT_CATEGORIES], []);

  const filteredCerts = useMemo(
    () =>
      category === ALL_CATEGORY
        ? certs
        : certs.filter((c) => c.category === category),
    [category],
  );

  const visible = showAll ? filteredCerts : filteredCerts.slice(0, 3);

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
      className="relative flex w-full scroll-mt-24 flex-col sm:scroll-mt-28 rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="absolute -top-[9px] left-4 bg-bg px-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
        certifications & achievements
      </div>

      <div className="mb-6 mt-2 flex shrink-0 justify-end">
        {/* category filter */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setShowAll(false);
            }}
            aria-label="Filter certifications by category"
            className="cursor-pointer appearance-none rounded-xl border-3 border-black bg-bg-panel py-1.5 pl-3 pr-8 text-xs font-semibold text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors hover:bg-bg-raised focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-bright"
          />
        </div>
      </div>

      {/* Cards area is capped at 680px and only scrolls internally once
          content would exceed that — with few cards it shrinks to fit
          instead of leaving a big empty gap; cards stay uniform h-80
          boxes regardless of category or certificate image.
          layoutScroll tells Framer Motion this ancestor is scrollable so
          its layoutId animations (grid <-> modal, hover tilt) measure
          position correctly instead of warping/clipping the card. */}
      <motion.div layoutScroll className="max-h-[680px] overflow-y-auto p-1">
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
            {visible.map((c) => (
              <CertCard
                key={c.name}
                cert={c}
                isOpen={selectedCert?.name === c.name}
                onOpen={() => setSelectedCert(c)}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-text-dim">
            No {category === ALL_CATEGORY ? "" : `${category.toLowerCase()} `}
            certifications yet.
          </p>
        )}
      </motion.div>

      {filteredCerts.length > 3 && (
        <div className="mt-4 flex h-12 shrink-0 items-center justify-center">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="inline-flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md border-3 border-black bg-bg-panel px-4 py-2 text-sm font-medium text-text hover:shadow-md transition"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      )}

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
  const [hovered, setHovered] = useState(false);

  // Raw pointer position within the card, normalized -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Smooth the raw values so the tilt settles instead of snapping
  const springConfig = { stiffness: 260, damping: 20, mass: 0.4 };
  const sx = useSpring(px, springConfig);
  const sy = useSpring(py, springConfig);

  // Wider tilt range (matches the punchier Card3D feel) — moving the
  // mouse toward the top tilts the card "away" at the top
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  // Sheen sweep + cursor-tracking glare, both driven by the same tilt
  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);
  const sheenAngle = useTransform(sx, [-0.5, 0.5], [105, 165]);
  const sheenBackground = useTransform(sheenAngle, (a) =>
    `linear-gradient(${a}deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    px.set((e.clientX - bounds.left) / bounds.width - 0.5);
    py.set((e.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handleMouseEnter = () => setHovered(true);

  const handleMouseLeave = () => {
    px.set(0);
    py.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative h-[26rem] w-full cursor-pointer [perspective:1200px]"
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
        className="relative h-full w-full overflow-hidden rounded-2xl border-3 border-black bg-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"      >
        {/* The certificate itself fills the card edge-to-edge (translated
            slightly back in Z so the glass/caption layers pop in front). */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ transform: "translateZ(-10px)" }}
        >
          {cert.image ? (
            <Image
              src={cert.image}
              alt={cert.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-bg-raised text-sm text-white/60">
              No preview
            </div>
          )}
        </motion.div>

        {/* Cursor-tracking radial glare */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            transform: "translateZ(15px)",
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 55%)`
            ),
          }}
        />
        {/* Diagonal sheen sweep, angle follows tilt direction */}
        <motion.div
          className="pointer-events-none absolute -inset-full"
          style={{
            transform: "translateZ(15px)",
            background: hovered ? sheenBackground : "transparent",
          }}
        />

        {/* Verified badge, top left — echoes a wax-seal / authenticity mark */}
        <motion.div
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ transform: "translateZ(25px)" }}
          animate={{ y: hovered ? -1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <Award size={12} className="text-black" />
        </motion.div>

        {/* Hover-reveal "view credential" action, top right */}
        <div
          className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border-2 border-black bg-white opacity-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          style={{ transform: "translateZ(25px)" }}
        >
          <ArrowUpRight size={16} className="text-black" />
        </div>

        {/* Solid caption panel, floating over the bottom of the image */}
        <motion.div
          className="absolute inset-x-3 bottom-3 overflow-hidden rounded-xl border-2 border-black bg-white px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ transform: "translateZ(25px)" }}
          animate={{ y: hovered ? -2 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="truncate text-sm font-bold leading-tight text-black">
            {cert.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-black/70">
            {cert.issuer} • {cert.year}
          </p>
        </motion.div>
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
        className="absolute inset-0 bg-black/60"
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
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border-3 border-black bg-bg-panel shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        role="dialog"
        aria-modal="true"
        aria-label={cert.name}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="w-full border-b-3 border-black sm:w-1/2 sm:border-b-0 sm:border-r-3">
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
                <h3 className="text-lg font-extrabold text-text-bright">
                  {cert.name}
                </h3>
                <p className="mt-1 text-sm text-text-dim">
                  {cert.issuer} • {cert.year}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black bg-bg-panel text-sm font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-none"
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
                    className="rounded-full border-2 border-black bg-bg-panel px-3 py-1 text-sm font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
                className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-black px-4 py-2 text-sm font-semibold text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-none"
              >
                Verify Credential
              </a>

              <button
                onClick={onClose}
                className="ml-auto rounded-md border-2 border-black bg-bg-panel px-4 py-2 text-sm font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-none"
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
