"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { springScrollToElement } from "@/lib/useScrollSnap";
import { useDraggable } from "./useDraggable";
import FloatingButton from "./FloatingButton";
import WheelMenu from "./WheelMenu";
import { DEFAULT_NAV_ITEMS, NavItem } from "./types";

interface MobileNavProps {
  items?: NavItem[];
  className?: string;
}

export default function MobileNav({
  items = DEFAULT_NAV_ITEMS,
  className = "",
}: MobileNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    position,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useDraggable();

  const dragDistanceRef = useRef(0);

  // Sync active section based on current scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = items.length - 1; i >= 0; i--) {
        const section = document.getElementById(items[i].sectionId);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top - 100) {
            setActiveIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  // Handle global touch move/up for dragging orb
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: TouchEvent | MouseEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      handlePointerMove(clientX, clientY);
    };

    const onEnd = () => {
      const { wasTap, totalDelta } = handlePointerUp();
      dragDistanceRef.current = totalDelta;

      // Only open wheel navigation on click/tap, not when dragging
      if (wasTap) {
        setIsExpanded(true);
      }
    };

    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchend", onEnd);
    window.addEventListener("mouseup", onEnd);

    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("mouseup", onEnd);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const handleSelectItem = useCallback((item: NavItem) => {
    // Scroll smoothly to target section
    springScrollToElement(item.sectionId);
    // Collapse back into floating orb
    setIsExpanded(false);
  }, []);

  return (
    <div className={`lg:hidden ${className}`}>
      {/* Dynamic Backdrop Blur Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-md touch-none"
          />
        )}
      </AnimatePresence>

      {/* Main Draggable / Morphing Navigation Surface */}
      {!isExpanded ? (
        /* IDLE ORB BUTTON */
        <FloatingButton
          position={position}
          isDragging={isDragging}
          onPointerDown={handlePointerDown}
          onClick={() => {
            if (dragDistanceRef.current < 8) {
              setIsExpanded(true);
            }
          }}
          activeSectionLabel={items[activeIndex]?.label}
        />
      ) : (
        /* EXPANDED WHEEL NAVIGATION OVERLAY */
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 32,
              mass: 0.9,
            }}
            className="pointer-events-auto relative w-[300px] h-[400px] rounded-3xl bg-white/95 backdrop-blur-xl border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-between p-6 select-none overflow-hidden"
          >
            {/* Header with Title & Close Button */}
            <div className="w-full flex items-center justify-between border-b-2 border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500">
                  drag to nav
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Vertical iOS Picker Wheel */}
            <WheelMenu
              items={items}
              activeIndex={activeIndex}
              onSelectIndex={setActiveIndex}
              onConfirmItem={handleSelectItem}
              isExpanded={isExpanded}
            />

            {/* Footer indicator button */}
            <div className="w-full pt-2 flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleSelectItem(items[activeIndex])}
                className="w-full py-2.5 px-4 bg-black text-white font-bold rounded-xl text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <span>Go to {items[activeIndex]?.label}</span>
                <span className="text-xs">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
