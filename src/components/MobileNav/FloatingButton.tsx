"use client";

import { motion } from "framer-motion";
import { Compass, Menu, Move } from "lucide-react";
import { Position } from "./types";

interface FloatingButtonProps {
  position: Position;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: () => void;
  activeSectionLabel?: string;
}

export default function FloatingButton({
  position,
  isDragging,
  onPointerDown,
  onClick,
  activeSectionLabel,
}: FloatingButtonProps) {
  return (
    <motion.div
      layoutId="floating-nav-surface"
      onPointerDown={onPointerDown}
      onClick={onClick}
      style={{
        left: position.x,
        top: position.y,
        position: "fixed",
        touchAction: "none",
      }}
      initial={false}
      animate={{
        scale: isDragging ? 1.12 : 1,
        boxShadow: isDragging
          ? "0 14px 28px rgba(0,0,0,0.25)"
          : "0 6px 16px rgba(0,0,0,0.18)",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28,
      }}
      className="z-[99] flex items-center justify-center w-14 h-14 rounded-full bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-grab active:cursor-grabbing select-none group"
    >
      {/* Background ambient glow/ring when dragging */}
      <motion.div
        animate={{ opacity: isDragging ? 1 : 0 }}
        className="absolute inset-0 rounded-full border-2 border-black/30 animate-ping pointer-events-none"
      />

      {/* Main orb icon with subtle rotate on drag */}
      <motion.div
        animate={{ rotate: isDragging ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center justify-center text-black"
      >
        <Compass className="w-6 h-6 stroke-[2.2] group-hover:rotate-12 transition-transform duration-300" />
      </motion.div>
    </motion.div>
  );
}
