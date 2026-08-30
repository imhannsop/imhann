"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";
import { NavItem } from "./types";

interface WheelMenuProps {
  items: NavItem[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onConfirmItem: (item: NavItem) => void;
  isExpanded: boolean;
}

const ITEM_HEIGHT = 52; // Height per wheel item in px

export default function WheelMenu({
  items,
  activeIndex,
  onSelectIndex,
  onConfirmItem,
  isExpanded,
}: WheelMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ y: number; indexAtStart: number; time: number } | null>(null);

  // Motion value for continuous vertical scroll displacement
  const yOffset = useMotionValue(0);

  // Keep target index centered
  useEffect(() => {
    yOffset.set(-activeIndex * ITEM_HEIGHT);
  }, [activeIndex, yOffset]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.stopPropagation();
      const delta = e.deltaY;
      if (Math.abs(delta) > 10) {
        const dir = delta > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(items.length - 1, activeIndex + dir));
        if (nextIndex !== activeIndex) {
          onSelectIndex(nextIndex);
        }
      }
    },
    [activeIndex, items.length, onSelectIndex]
  );

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartRef.current = {
      y: clientY,
      indexAtStart: activeIndex,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartRef.current) return;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = touchStartRef.current.y - clientY;
    
    // Calculate index shift based on drag displacement
    const indexShift = Math.round(deltaY / ITEM_HEIGHT);
    const targetIdx = Math.max(
      0,
      Math.min(items.length - 1, touchStartRef.current.indexAtStart + indexShift)
    );

    if (targetIdx !== activeIndex) {
      onSelectIndex(targetIdx);
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[280px] flex items-center justify-center overflow-hidden touch-none select-none"
    >
      {/* Dynamic Wheel Center Selection Overlay / Guideline */}
      <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[52px] bg-black/5 dark:bg-white/10 rounded-2xl border border-black/10 dark:border-white/15 pointer-events-none shadow-inner" />

      {/* Wheel items list container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {items.map((item, index) => {
          const offsetFromActive = index - activeIndex;
          const absOffset = Math.abs(offsetFromActive);
          const isActive = offsetFromActive === 0;

          // 3D Wheel Physics & Visual Properties
          // Rotation along X axis creates true cylinder/barrel roll effect
          const rotateX = offsetFromActive * -18;
          const translateY = offsetFromActive * 44;
          const scale = isActive ? 1.18 : Math.max(0.72, 1 - absOffset * 0.14);
          const opacity = isActive ? 1 : Math.max(0.2, 1 - absOffset * 0.35);
          const blurPx = isActive ? 0 : Math.min(4, absOffset * 1.5);

          return (
            <motion.div
              key={item.id}
              onClick={() => {
                onSelectIndex(index);
                onConfirmItem(item);
              }}
              initial={false}
              animate={{
                y: translateY,
                rotateX,
                scale,
                opacity,
                filter: `blur(${blurPx}px)`,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
              style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
              }}
              className={`absolute flex items-center justify-center gap-3 cursor-pointer py-2 px-6 rounded-full transition-colors duration-200 ${
                isActive
                  ? "text-black font-extrabold text-2xl tracking-tight"
                  : "text-zinc-600 font-medium text-lg hover:text-black"
              }`}
            >
              {/* Active Selection Indicator Arrow */}
              {isActive && (
                <motion.span
                  layoutId="active-nav-arrow"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="text-black text-sm"
                >
                  ▶
                </motion.span>
              )}

              <span>{item.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
