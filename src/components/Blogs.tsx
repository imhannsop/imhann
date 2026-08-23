"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { books } from "@/lib/data";

type Book = (typeof books)[number];

const SPINE_COLORS: Record<string, string> = {
  c1: "#ffffff",
  c2: "#e2e2e2",
  c3: "#c4c4c4",
  c4: "#a3a3a3",
};

function spineColor(color: string) {
  return SPINE_COLORS[color] ?? SPINE_COLORS.c1;
}

// Niri WM-style spring for initial card expansion
const NIRI_SPRING = {
  type: "spring",
  stiffness: 750,
  damping: 52,
  mass: 0.8,
} as const;

// Realistic paper page flip easing (cubic-bezier tuned for paper weight and flip momentum)
const PAGE_FLIP_TRANSITION = {
  duration: 0.95,
  ease: [0.645, 0.045, 0.355, 1],
} as const;

const FADE_TRANSITION = { duration: 0.3, ease: "easeOut" } as const;

const coverVariants: Variants = {
  closed: { rotateY: 0 },
  open: { rotateY: -175 },
};

export default function Blogs() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);

  const openBook = (idx: number) => {
    setFlipped(false);
    setOpenIdx(idx);
  };

  const closeBook = () => {
    setFlipped(false);
    setOpenIdx(null);
  };

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBook();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx]);

  const book = openIdx !== null ? books[openIdx] : null;

  return (
    <>
      <div
        className="relative scroll-mt-24 sm:scroll-mt-28 rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        id="blogs"
      >
        <div className="mb-6 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">
          blogs — the library
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-min items-end gap-3 border-b-3 border-black px-2 pb-6 pt-4">
            {books.map((b, i) => (
              <BookSpine
                key={b.title}
                book={b}
                isOpen={openIdx === i}
                onOpen={() => openBook(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {book && (
          <Modal
            key={book.title}
            book={book}
            flipped={flipped}
            onToggleFlip={() => setFlipped((prev) => !prev)}
            onClose={closeBook}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function BookSpine({
  book,
  isOpen,
  onOpen,
}: {
  book: Book;
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      onClick={onOpen}
      aria-label={`Open ${book.title}`}
      whileHover={{ y: -6 }}
      whileTap={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative h-[220px] w-[68px] sm:h-[240px] sm:w-[76px] flex-none cursor-pointer"
    >
      <motion.div
        layoutId={`book-card-${book.title}`}
        style={{
          backgroundColor: spineColor(book.color),
          opacity: isOpen ? 0 : 1,
        }}
        transition={NIRI_SPRING}
        className="absolute inset-0 overflow-hidden rounded-md border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 group-hover:shadow-[5px_7px_0px_0px_rgba(0,0,0,1)]"
      >
        <span className="absolute bottom-4 left-1/2 max-h-[170px] sm:max-h-[190px] -translate-x-1/2 overflow-hidden text-sm sm:text-[15px] font-bold tracking-[.02em] text-black [writing-mode:vertical-rl] [transform:rotate(180deg)] select-none">
          {book.title}
        </span>
      </motion.div>
    </motion.button>
  );
}

function Modal({
  book,
  flipped,
  onToggleFlip,
  onClose,
}: {
  book: Book;
  flipped: boolean;
  onToggleFlip: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={FADE_TRANSITION}
      />

      {/* Morphing Layout Container */}
      <motion.div
        layoutId={`book-card-${book.title}`}
        transition={NIRI_SPRING}
        className="relative z-10 w-[95vw] sm:w-[90vw] md:w-[75vw] lg:w-[65vw] max-w-[850px] h-[85vh] sm:h-[80vh] min-h-[75vh] max-h-[760px] rounded-xl border-3 border-black bg-bg-panel shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center cursor-pointer rounded-xl border-3 border-black bg-bg-panel text-text-bright shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors hover:bg-bg-raised"
        >
          <X size={18} />
        </button>

        {/* 3D Book Stage */}
        <div
          className="relative h-full w-full [perspective:1800px] [transform-style:preserve-3d]"
          role="dialog"
          aria-modal="true"
          aria-label={book.title}
        >
          {/* Inside Page (Right hand page) */}
          <div className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] bg-paper p-6 sm:p-12 text-paper-ink [backface-visibility:hidden]">
            {/* Spine seam shadow overlay */}
            <motion.div
              animate={{ opacity: flipped ? 0 : 0.35 }}
              transition={PAGE_FLIP_TRANSITION}
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/30 to-transparent"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: flipped ? 1 : 0 }}
              transition={{
                duration: 0.35,
                delay: flipped ? 0.3 : 0,
                ease: "easeOut",
              }}
            >
              <h4 className="mb-2 font-serif text-2xl sm:text-4xl font-bold leading-tight pr-12">
                {book.title}
              </h4>
              <div className="mb-6 text-xs sm:text-sm tracking-[.04em] text-[#7a6a4a]">
                {book.meta}
              </div>
              <p className="font-serif text-base sm:text-lg italic leading-[1.8] text-[#4a3f2b]">
                {book.excerpt}
              </p>
            </motion.div>
          </div>

          {/* Front Cover / Flipping Page */}
          <motion.div
            onClick={onToggleFlip}
            style={{
              backgroundColor: spineColor(book.color),
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
            }}
            variants={coverVariants}
            initial="closed"
            animate={flipped ? "open" : "closed"}
            exit="closed"
            transition={PAGE_FLIP_TRANSITION}
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center p-8 text-center [backface-visibility:hidden]"
          >
            {/* Dynamic Page Shadow (Deepens mid-flip) */}
            <motion.div
              animate={{ opacity: flipped ? 0.4 : 0 }}
              transition={PAGE_FLIP_TRANSITION}
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"
            />

            {/* Page Crease Highlight Line on the left hinge */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[2px] bg-black/20" />

            <div className="select-none relative z-10">
              <div className="font-serif text-2xl sm:text-4xl font-bold text-black">
                {book.title}
              </div>
              <div className="mt-3 text-xs sm:text-sm tracking-[.1em] text-black/60 uppercase font-medium">
                {flipped ? "tap to close page" : "tap to flip page"}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}