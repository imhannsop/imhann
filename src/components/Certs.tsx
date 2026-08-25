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

// Shared spring used by BOTH the card's layoutId element and the modal's —
// keeping it identical (rather than each defining its own) is what makes
// open and close feel like the same motion running forward/backward
// instead of two similar-but-not-quite-matched animations.
const MORPH_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.8,
};

export default function Certs() {
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [category, setCategory] = useState<string>(ALL_CATEGORY);

  const categories = useMemo(() => [ALL_CATEGORY, ...CERT_CATEGORIES], []);

  const filteredCerts = useMemo(
    () =>
      category === ALL_CATEGORY
        ? certs
        : certs.filter((c) => c.category === category),
    [category],
  );

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
      className="relative flex w-full scroll-mt-3 md:scroll-mt-20 flex-col rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="absolute -top-[9px] left-4 bg-bg px-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
        certifications & achievements
      </div>

      <div className="mb-6 mt-2 flex shrink-0 justify-end">
        {/* category filter */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter certifications by category"
            className="cursor-pointer appearance-none rounded-2xl border-3 border-black bg-bg-panel py-2 pl-3 pr-8 text-xs font-semibold text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors hover:bg-bg-raised focus:outline-none"
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

      {/* Height caps are chosen per breakpoint so exactly 2 cards are
          visible before scrolling kicks in. Below sm: the grid is a
          single column of aspect-[7/5] cards, so max-h-[620px] fits 2
          stacked cards + the row gap. At sm: and up the grid switches
          to 2 columns with a fixed h-[26rem] (416px) card height — that
          breakpoint is what the max-h switches on too (not md:), since
          switching later would leave a mismatched height while the
          grid has already gone to 2 columns. overflow-x-hidden stops
          any sideways scroll; the pb-3/pr-2 padding (on top of the
          pre-existing p-1) keeps the card's 4px drop-shadow from being
          sheared off at the container edge while scrolling. */}
      <motion.div
        layoutScroll
        layout
        className="max-h-[620px] overflow-y-auto overflow-x-hidden scroll-smooth p-1 pb-3 pr-2 sm:max-h-[26.75rem] [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.25)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-thumb]:hover:bg-black/30"
      >
        {filteredCerts.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredCerts.map((c) => (
                <CertCard
                  key={c.name}
                  cert={c}
                  isOpen={selectedCert?.name === c.name}
                  onOpen={() => setSelectedCert(c)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-text-dim">
            No {category === ALL_CATEGORY ? "" : `${category.toLowerCase()} `}
            certifications yet.
          </p>
        )}
      </motion.div>

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

  // Neutralize tilt/hover before handing off to the modal — otherwise a
  // card opened mid-tilt would still be visibly rotated for the one frame
  // before opacity kicks in, since rotation and opacity are on separate
  // motion values with separate timing.
  const handleOpen = () => {
    px.set(0);
    py.set(0);
    setHovered(false);
    onOpen();
  };

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={handleOpen}
      onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-[7/5] w-full cursor-pointer [perspective:1200px] sm:aspect-auto sm:h-[26rem]"
    >
      {/* This is the element that shares layoutId with the modal.
          Hiding it while open (rather than unmounting) lets Framer Motion
          animate the *same* element from its grid position into the modal. */}
      <motion.div
        layoutId={`cert-card-${cert.name}`}
        layout
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          opacity: isOpen ? 0 : 1,
          boxShadow: isOpen
            ? "0px 0px 0px 0px rgba(0,0,0,0)"
            : "4px 4px 0px 0px rgba(0,0,0,1)",
        }}
        transition={MORPH_TRANSITION}
        className="relative h-full w-full overflow-hidden rounded-2xl border-3 border-black bg-transparent"      >
        {/* The certificate itself fills the card edge-to-edge on desktop
            (translated slightly back in Z so the glass/caption layers pop
            in front). On mobile it switches to object-contain, matching
            the modal's uncropped preview — object-cover was zooming/
            cropping the certificate edges on small screens, which reads
            as "wrong" next to the full-image modal view. */}
        <motion.div
          className="absolute inset-0 bg-white sm:bg-transparent"
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
              className="object-contain p-1.5 sm:object-cover sm:p-0"
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
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-2xl border-2 border-black bg-white px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ transform: "translateZ(25px)" }}
          animate={{ y: hovered ? -1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-2xl bg-emerald-500" />
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
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Same layoutId as the grid card: Framer Motion animates this
          element seamlessly from the card's screen position/size into
          this centered, larger layout. Capped at 92vh and scrolls
          internally — the fixed backdrop above always covers the full
          viewport regardless of how tall this panel's content gets, and
          nothing inside (image, description, tags, buttons) ever gets
          cut off by the screen edge on short mobile viewports. */}
      <motion.div
        layoutId={`cert-card-${cert.name}`}
        layout
        initial={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
        animate={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
        exit={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
        transition={MORPH_TRANSITION}
        className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-y-auto overflow-x-hidden overscroll-contain rounded-2xl border-3 border-black bg-bg-panel"
        role="dialog"
        aria-modal="true"
        aria-label={cert.name}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="w-full shrink-0 border-b-3 border-black sm:w-1/2 sm:border-b-0 sm:border-r-3">
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
            <div>
              <h3 className="text-lg font-extrabold text-text-bright">
                {cert.name}
              </h3>
              <p className="mt-1 text-sm text-text-dim">
                {cert.issuer} • {cert.year}
              </p>
            </div>

            {cert.summary && (
              <p className="mt-4 text-sm text-text">{cert.summary}</p>
            )}

            {cert.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {cert.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black bg-bg-panel px-3 py-1 text-sm font-medium shadow-none sm:rounded-xl sm:border-2 sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-3 border-black bg-black px-4 py-2 text-sm font-semibold text-white shadow-none transition sm:flex-none sm:rounded-2xl sm:px-4 sm:py-2 sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-none"
              >
                Verify Credential
              </a>

              <button
                onClick={onClose}
                className="ml-auto rounded-2xl border-3 border-black bg-bg-panel px-4 py-2 text-sm font-medium shadow-none transition sm:rounded-2xl sm:px-4 sm:py-2 sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-none"
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
