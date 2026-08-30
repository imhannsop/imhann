'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevicePerf } from '@/lib/useDevicePerf';
import { EASE_SMOOTH, MORPH_TRANSITION } from '@/lib/transitions';
import { useModalEscape } from '@/lib/useModalEscape';


const PHOTO_SRC = '/images/charac.png';

const DISPLAY = "font-['Space_Grotesk','Archivo_Black',sans-serif]";
const MONO = "font-['IBM_Plex_Mono','SFMono-Regular',Consolas,monospace]";


const contentStagger = {
  hidden: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.14 } },
};
const contentItem = {
  hidden: { opacity: 0, y: 8, transition: { duration: 0.15, ease: EASE_SMOOTH } },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_SMOOTH },
  },
};

export interface HeroProps {
  /** Value shown in the NAME field. */
  name?: string;
  /** Value shown in the ROLE field. */
  role?: string;
  /** Short tags shown in the STACK field. */
  skills?: string[];
  /** One or two sentence tagline / clearance note under the fields. */
  tagline?: string;
  /** ID number printed under the barcode. */
  idNumber?: string;
  className?: string;
}

export default function Hero({
  name = 'SOP',
  role = 'FULL-STACK DEVELOPER',
  skills = ['LINUX', 'WEB', 'CHAOS'],
  tagline = 'Builds fast web tools and breaks his Linux setup for fun — usually in that order.',
  idNumber = 'ID-0042-SOP',
  className,
}: HeroProps) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { isLowEnd, prefersReducedMotion } = useDevicePerf();
  const skipEffects = isLowEnd || prefersReducedMotion;

  const closeExpanded = useCallback(() => setExpanded(false), []);
  useModalEscape(expanded, closeExpanded);

  return (
    <section
      id="home"
      className={`relative flex w-full min-h-[768px] max-sm:min-h-[620px] scroll-mt-3 md:scroll-mt-20 flex-col items-center justify-center overflow-hidden rounded-xl border-3 border-black bg-bg-panel p-10 max-sm:p-5 pt-16 max-sm:pt-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] box-border ${className ?? ''}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
        @media (prefers-reduced-motion: no-preference) {
          .badge-float { animation: badge-float-y 4.5s ease-in-out infinite; }
          .hologram-spin { animation: hologram-spin-rotate 9s linear infinite; }
          .hologram-spin-rev { animation: hologram-spin-rotate 11s linear infinite reverse; }
          .hologram-mote { animation: hologram-mote-rise 3.6s ease-in infinite; }
          .hologram-mote-fall { animation: hologram-mote-fall 3.2s ease-in infinite; }
          .grid-particle { animation: grid-particle-twinkle 2.8s ease-in-out infinite; }
          .scanline-sweep { animation: scanline-sweep 7s linear infinite; }
          .corner-blink { animation: corner-blink 1.6s ease-in-out infinite; }
        }
        @keyframes badge-float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes hologram-spin-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes hologram-mote-rise {
          0% { transform: translateY(0px); opacity: 0; }
          15% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-96px); opacity: 0; }
        }
        @keyframes hologram-mote-fall {
          0% { transform: translateY(0px); opacity: 0; }
          15% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(64px); opacity: 0; }
        }
        @keyframes grid-particle-twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.8; }
        }
        @keyframes scanline-sweep {
          0% { transform: translateY(-10%); opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translateY(880%); opacity: 0; }
        }
        @keyframes corner-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>

      {/* Grid floor and ceiling */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(17,17,17,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.35) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          transform: 'perspective(400px) rotateX(-58deg)',
          transformOrigin: 'top center',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(17,17,17,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.35) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          transform: 'perspective(400px) rotateX(58deg)',
          transformOrigin: 'bottom center',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
          maskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />

      {/* Warm glow behind the badge, gives the scene a light source */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[40%] z-0 h-[560px] w-[560px] max-sm:h-[380px] max-sm:w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,90,31,0.12) 0%, rgba(255,90,31,0.05) 42%, transparent 72%)',
        }}
      />

      {!skipEffects && <RadiatingLines />}

      {!skipEffects && (
        <div
          aria-hidden="true"
          className="scanline-sweep pointer-events-none absolute inset-x-0 top-0 z-0 h-28 opacity-0"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(17,17,17,0.07), transparent)' }}
        />
      )}

      <CornerFrame />

      {!skipEffects && <GridParticles />}

      {/* Top ring decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-3 z-0 -translate-x-1/2 scale-[0.6] sm:scale-[0.85]"
      >
        <HologramRingTop />
      </div>

      <div className="relative flex w-full flex-col items-center pb-8">
        {/* Hologram projector base */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-full z-0 -translate-x-1/2 -translate-y-[54px] scale-90 sm:scale-125"
        >
          <HologramBase />
        </div>

        <div className={`relative z-10 flex flex-col items-center ${expanded || skipEffects ? '' : 'badge-float'}`}>
          {/* Collapsed badge card */}
          <motion.div
            layoutId="hero-id-card"
            layout
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            aria-label={`Expand ${name}'s badge`}
            className={`relative flex w-[300px] max-w-[88vw] min-h-[340px] max-sm:min-h-[300px] box-border cursor-pointer flex-col rounded-2xl border-[3px] border-black bg-white p-7 max-sm:p-5 transition-[box-shadow] duration-200 ${expanded
              ? 'shadow-[0px_0px_0px_0px_rgba(0,0,0,0)]'
              : hovered
                ? 'shadow-[14px_14px_0px_0px_rgba(17,17,17,1)]'
                : 'shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
              }`}
            animate={{
              opacity: expanded ? 0 : 1,
              rotate: expanded ? 0 : hovered ? 0 : -1.5,
            }}
            transition={MORPH_TRANSITION}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setExpanded(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setExpanded(true);
              }
            }}
          >
            {/* Badge clip hole */}
            <div
              aria-hidden="true"
              className="absolute -top-[14px] left-1/2 h-[28px] w-[104px] max-sm:h-[22px] max-sm:w-[84px] -translate-x-1/2 rounded-md border-[3px] border-black bg-white"
            />
            <div
              aria-hidden="true"
              className="absolute -top-[6px] left-1/2 h-[16px] w-[16px] max-sm:h-[12px] max-sm:w-[12px] -translate-x-1/2 rounded-full border-2 border-black bg-white"
            />

            {/* header */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className={`text-[0.72rem] max-sm:text-[0.62rem] font-bold tracking-[0.14em] text-neutral-500 ${DISPLAY}`}>
                USA
              </span>
              <span
                className={`rotate-3 border-2 border-black bg-[#FF5A1F] px-2 py-0.5 text-[0.62rem] max-sm:text-[0.55rem] font-semibold tracking-[0.06em] text-white ${MONO}`}
              >
                TAP TO OPEN
              </span>
            </div>

            {/* Profile photo */}
            <div className="mt-5 max-sm:mt-3 flex flex-1 flex-col items-center justify-center">
              <div className="h-[140px] w-[140px] max-sm:h-[100px] max-sm:w-[100px] flex-shrink-0 overflow-hidden rounded-xl border-[3px] border-black bg-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PHOTO_SRC}
                  alt={`${name} portrait`}
                  className="block h-full w-full object-cover object-top grayscale contrast-125"
                />
              </div>
              <p className={`mt-4 max-sm:mt-3 text-center text-[1.7rem] max-sm:text-[1.3rem] font-bold leading-tight tracking-tight ${DISPLAY}`}>
                {name}
              </p>
              <p className={`mt-1 text-center text-[0.9rem] max-sm:text-[0.78rem] tracking-[0.08em] text-neutral-600 ${MONO}`}>
                {role}
              </p>
            </div>

            {/* footer */}
            <div className="mt-5 max-sm:mt-3 flex items-center justify-between border-t-2 border-dotted border-black pt-3">
              <span className={`text-[0.78rem] max-sm:text-[0.68rem] tracking-[0.06em] text-neutral-600 ${MONO}`}>
                {idNumber}
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Expanded badge modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_SMOOTH }}
          >
            <motion.div
              onClick={() => setExpanded(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={skipEffects ? {} : { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              className={`absolute inset-0 ${skipEffects ? 'bg-black/70' : 'bg-black/60'}`}
            />

            <motion.div
              layoutId="hero-id-card"
              layout
              initial={false}
              animate={{ boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)' }}
              exit={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
              transition={MORPH_TRANSITION}
              className="badge-card relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto box-border rounded-2xl border-[3px] border-black bg-white p-5 sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-label={`${name} badge details`}
            >
              {/* close button */}
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close badge"
                className={`absolute right-3 top-3 sm:right-4 sm:top-4 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-black bg-white text-sm font-bold shadow-[2px_2px_0_#111111] ${DISPLAY}`}
              >
                ×
              </button>

              {/* Badge clip hole */}
              <div
                aria-hidden="true"
                className="absolute -top-[14px] left-1/2 h-[30px] w-[110px] max-sm:h-[22px] max-sm:w-[84px] -translate-x-1/2 rounded-md border-[3px] border-black bg-white"
              />
              <div
                aria-hidden="true"
                className="absolute -top-[6px] left-1/2 h-[17px] w-[17px] max-sm:h-[12px] max-sm:w-[12px] -translate-x-1/2 rounded-full border-2 border-black bg-white"
              />

              <motion.div variants={contentStagger} initial="hidden" animate="visible" exit="hidden">
                {/* header row */}
                <motion.div
                  variants={contentItem}
                  className="mt-3 flex flex-wrap items-center gap-2 justify-between pr-8 sm:pr-10"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`text-sm sm:text-base font-bold tracking-[0.1em] sm:tracking-[0.14em] ${DISPLAY}`}>
                      UNIVERSITY OF SAN AGUSTIN
                    </span>
                  </div>

                  <span
                    className={`rotate-3 border-2 border-black bg-[#FF5A1F] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[0.68rem] sm:text-[0.8rem] font-semibold tracking-[0.06em] sm:tracking-[0.08em] text-white ${MONO}`}
                  >
                    AUTHORIZED
                  </span>
                </motion.div>

                {/* Content fields and photo */}
                <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row flex-wrap gap-6 sm:gap-8">
                  <motion.div
                    variants={contentItem}
                    className="min-w-0 sm:min-w-[260px] flex-1 basis-full sm:basis-[320px]"
                  >
                    <FieldRow label="NAME" value={name} big />
                    <FieldRow label="ROLE" value={role} />

                    <div className="mt-4 flex items-baseline">
                      <span className={`flex-shrink-0 text-[0.8rem] tracking-[0.1em] text-neutral-600 ${MONO}`}>
                        STACK
                      </span>
                      <hr className="ml-2.5 flex-1 border-0 border-b-2 border-dotted border-black" />
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className={`border-2 border-black px-2.5 py-1 text-[0.78rem] tracking-[0.05em] ${MONO}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <FieldRow label="STATUS" value="ONLINE ●" mono topGap />

                    <p className={`mt-5 mb-0 max-w-[38ch] text-[1rem] max-sm:text-[0.9rem] font-medium leading-[1.45] text-neutral-700 ${DISPLAY}`}>
                      {tagline}
                    </p>
                  </motion.div>

                  {/* Profile photo */}
                  <motion.div
                    variants={contentItem}
                    className="relative mx-auto sm:mx-0 h-[130px] w-[130px] sm:h-[170px] sm:w-[170px] flex-shrink-0"
                  >
                    <div className="h-full w-full overflow-hidden rounded-lg border-[3px] border-black bg-neutral-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={PHOTO_SRC}
                        alt={`${name} portrait`}
                        className="block h-full w-full object-cover object-top grayscale contrast-125"
                      />
                    </div>
                    {/* Clip tab decoration */}
                    <div
                      aria-hidden="true"
                      className="absolute -top-[18px] right-[18px] h-6 w-[44px] rounded-t-md border-[3px] border-black bg-white"
                    />
                  </motion.div>
                </div>

                {/* footer: barcode */}
                <motion.div
                  variants={contentItem}
                  className="mt-7 sm:mt-9 flex flex-wrap items-end justify-between gap-3 sm:gap-4 border-t-2 border-black pt-4 sm:pt-5"
                >
                  <Barcode />
                  <span className={`whitespace-nowrap text-[0.78rem] sm:text-[0.85rem] tracking-[0.06em] ${MONO}`}>
                    {idNumber}
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Hologram projector graphic
function HologramBase() {
  const ticks = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 2 * Math.PI;
    const x1 = 150 + Math.cos(angle) * 142;
    const y1 = 150 + Math.sin(angle) * 38;
    const x2 = 150 + Math.cos(angle) * 156;
    const y2 = 150 + Math.sin(angle) * 44;
    return { x1, y1, x2, y2, key: i };
  });

  return (
    <div className="relative" style={{ width: 300 }}>
      <svg viewBox="0 0 300 200" width="300" height="200" className="block overflow-visible">
        <defs>
          <pattern id="hologramHatch" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#111111" />
            <rect width="5" height="10" fill="#FFFFFF" />
          </pattern>
        </defs>

        {/* Projector beam */}
        <polygon
          points="118,0 182,0 248,120 52,120"
          fill="url(#hologramHatch)"
          stroke="#111111"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* radiating scan ticks */}
        {ticks.map((t) => (
          <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#111111" strokeWidth="2" />
        ))}

        {/* outer ring */}
        <ellipse cx="150" cy="150" rx="140" ry="36" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
        {/* spinning dashed ring */}
        <g className="hologram-spin" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <ellipse cx="150" cy="150" rx="104" ry="26" fill="none" stroke="#111111" strokeWidth="2" strokeDasharray="7 6" />
        </g>
        {/* accent ring */}
        <ellipse cx="150" cy="150" rx="66" ry="16" fill="#111111" stroke="#111111" strokeWidth="3" />
        {/* core */}
        <ellipse cx="150" cy="150" rx="24" ry="6" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
      </svg>

      {/* Floating particles */}
      <span
        className="hologram-mote absolute h-[6px] w-[6px] border-2 border-black bg-white opacity-0"
        style={{ left: '36%', bottom: 92 }}
      />
      <span
        className="hologram-mote absolute h-[6px] w-[6px] border-2 border-black bg-white opacity-0"
        style={{ left: '52%', bottom: 92, animationDelay: '1.1s' }}
      />
      <span
        className="hologram-mote absolute h-[6px] w-[6px] border-2 border-black bg-white opacity-0"
        style={{ left: '44%', bottom: 92, animationDelay: '2.3s' }}
      />
    </div>
  );
}

// Top hologram ring graphic
function HologramRingTop() {
  const ticks = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * 2 * Math.PI;
    const x1 = 150 + Math.cos(angle) * 118;
    const y1 = 60 + Math.sin(angle) * 30;
    const x2 = 150 + Math.cos(angle) * 132;
    const y2 = 60 + Math.sin(angle) * 36;
    return { x1, y1, x2, y2, key: i };
  });

  return (
    <div className="relative" style={{ width: 300 }}>
      <svg viewBox="0 0 300 160" width="300" height="160" className="block overflow-visible">
        {/* Downward rays */}
        {[70, 110, 150, 190, 230].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={68}
            x2={x}
            y2={150}
            stroke="#111111"
            strokeWidth="2"
            strokeDasharray="3 5"
            opacity={0.55}
          />
        ))}

        {ticks.map((t) => (
          <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#111111" strokeWidth="1.5" />
        ))}

        <ellipse cx="150" cy="60" rx="118" ry="30" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
        <g className="hologram-spin-rev" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <ellipse cx="150" cy="60" rx="86" ry="22" fill="none" stroke="#111111" strokeWidth="2" strokeDasharray="6 5" />
        </g>
        <ellipse cx="150" cy="60" rx="54" ry="13" fill="#111111" stroke="#111111" strokeWidth="3" />
        <ellipse cx="150" cy="60" rx="20" ry="5" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
      </svg>

      {/* Falling particles */}
      <span
        className="hologram-mote-fall absolute h-[6px] w-[6px] border-2 border-black bg-white opacity-0"
        style={{ left: '30%', top: 66 }}
      />
      <span
        className="hologram-mote-fall absolute h-[6px] w-[6px] border-2 border-black bg-white opacity-0"
        style={{ left: '58%', top: 66, animationDelay: '1s' }}
      />
      <span
        className="hologram-mote-fall absolute h-[6px] w-[6px] border-2 border-black bg-white opacity-0"
        style={{ left: '48%', top: 66, animationDelay: '2s' }}
      />
    </div>
  );
}

// Background grid particles, loosely wired together like a sensor constellation
function GridParticles() {
  const dots = [
    { x: 8, y: 18, s: 5, d: '0s' },
    { x: 16, y: 52, s: 4, d: '0.4s' },
    { x: 24, y: 30, s: 6, d: '0.9s' },
    { x: 31, y: 70, s: 4, d: '1.3s' },
    { x: 68, y: 22, s: 5, d: '0.6s' },
    { x: 76, y: 58, s: 4, d: '1.7s' },
    { x: 84, y: 38, s: 6, d: '0.2s' },
    { x: 91, y: 66, s: 4, d: '2.1s' },
    { x: 12, y: 82, s: 4, d: '1.1s' },
    { x: 88, y: 80, s: 5, d: '1.9s' },
    { x: 5, y: 44, s: 4, d: '0.7s' },
    { x: 95, y: 47, s: 4, d: '1.5s' },
  ];
  // index pairs into `dots` — kept short and deliberately uneven, like a signal map, not a grid
  const links: [number, number][] = [
    [0, 2],
    [2, 1],
    [1, 10],
    [3, 8],
    [4, 6],
    [6, 5],
    [5, 9],
    [7, 9],
    [4, 11],
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-[0.18]"
      >
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={dots[a].x}
            y1={dots[a].y}
            x2={dots[b].x}
            y2={dots[b].y}
            stroke="#111111"
            strokeWidth="0.15"
            strokeDasharray="1.2 1.6"
          />
        ))}
      </svg>
      {dots.map((d, i) => (
        <span
          key={i}
          className="grid-particle absolute border-2 border-black bg-white"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDelay: d.d }}
        />
      ))}
    </div>
  );
}

// Thin schematic lines radiating from the projector core, filling the
// negative space the way blueprint / radar sweeps do
function RadiatingLines() {
  const CENTER = { x: 500, y: 260 };
  const COUNT = 28;
  const RADIUS = 900;
  const lines = Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * 2 * Math.PI;
    return {
      key: i,
      x2: CENTER.x + Math.cos(angle) * RADIUS,
      y2: CENTER.y + Math.sin(angle) * RADIUS,
    };
  });
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 700"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.06]"
    >
      {lines.map((l) => (
        <line key={l.key} x1={CENTER.x} y1={CENTER.y} x2={l.x2} y2={l.y2} stroke="#111111" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// Camera-viewfinder style corner readouts, framing the whole panel
function CornerFrame() {
  const label = `text-[0.6rem] tracking-[0.14em] text-neutral-500 whitespace-nowrap ${MONO}`;
  return (
    <>
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 max-sm:left-3 max-sm:top-3">
        <div className="h-4 w-4 border-l-2 border-t-2 border-black/60" />
        <span className={`${label} max-sm:hidden`}>SIG-0042</span>
      </div>
      <div className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-2 max-sm:right-3 max-sm:top-3">
        <span className={`${label} max-sm:hidden`}>STATUS: LOCKED</span>
        <div className="h-4 w-4 border-r-2 border-t-2 border-black/60" />
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 max-sm:bottom-3 max-sm:left-3">
        <div className="h-4 w-4 border-b-2 border-l-2 border-black/60" />
        <span className={`${label} flex items-center gap-1.5 max-sm:hidden`}>
          <span className="corner-blink inline-block h-1.5 w-1.5 rounded-full bg-[#FF5A1F]" />
          SCANNING
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-2 max-sm:bottom-3 max-sm:right-3">
        <span className={`${label} max-sm:hidden`}>UPLINK ●</span>
        <div className="h-4 w-4 border-b-2 border-r-2 border-black/60" />
      </div>
    </>
  );
}

function FieldRow({
  label,
  value,
  big = false,
  mono = false,
  topGap = false,
}: {
  label: string;
  value: string;
  big?: boolean;
  mono?: boolean;
  topGap?: boolean;
}) {
  return (
    <div className={`flex items-baseline ${topGap ? 'mt-4' : big ? 'mt-0' : 'mt-2.5'}`}>
      <span className={`w-[56px] sm:w-[70px] flex-shrink-0 text-[0.72rem] sm:text-[0.8rem] tracking-[0.1em] text-neutral-600 ${MONO}`}>
        {label}
      </span>
      <span
        className={`ml-2 sm:ml-3 ${mono ? MONO : DISPLAY} ${mono ? 'font-semibold' : 'font-bold'} ${big ? 'text-[1.5rem] sm:text-[2rem] tracking-tight' : 'text-[0.95rem] sm:text-[1.1rem] tracking-wide'
          } ${mono ? 'text-green-800' : 'text-black'}`}
      >
        {value}
      </span>
    </div>
  );
}

// Static barcode graphic
function Barcode() {
  const widths = [2, 1, 3, 1, 1, 2, 1, 4, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1];
  return (
    <div className="flex h-[36px] sm:h-[44px] items-stretch gap-px" aria-hidden="true">
      {widths.map((w, i) => (
        <div
          key={i}
          className={i % 5 === 0 ? 'bg-neutral-400' : 'bg-black'}
          style={{ width: w * 2 }}
        />
      ))}
    </div>
  );
}
