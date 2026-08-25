"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Position } from "./types";

const POSITION_STORAGE_KEY = "ekoubu_floating_nav_pos";
const VIEWPORT_PADDING = 16;
const BUTTON_SIZE = 56;

export function useDraggable() {
  const [position, setPosition] = useState<Position>({ x: 24, y: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // 0 (idle) to 1 (expanded)
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number; time: number } | null>(null);
  const totalDeltaRef = useRef<number>(0);

  // Initialize position to bottom-left corner of screen on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(POSITION_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure within current viewport bounds
        const maxX = window.innerWidth - BUTTON_SIZE - VIEWPORT_PADDING;
        const maxY = window.innerHeight - BUTTON_SIZE - VIEWPORT_PADDING;
        const clampedX = Math.max(VIEWPORT_PADDING, Math.min(parsed.x, maxX));
        const clampedY = Math.max(VIEWPORT_PADDING, Math.min(parsed.y, maxY));
        setPosition({ x: clampedX, y: clampedY });
        return;
      } catch (e) {
        // Fallback to default
      }
    }

    // Default: Bottom-left corner
    const defaultX = VIEWPORT_PADDING + 8;
    const defaultY = window.innerHeight - BUTTON_SIZE - VIEWPORT_PADDING - 40;
    setPosition({ x: defaultX, y: Math.max(VIEWPORT_PADDING, defaultY) });
  }, []);

  // Update bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const maxX = window.innerWidth - BUTTON_SIZE - VIEWPORT_PADDING;
        const maxY = window.innerHeight - BUTTON_SIZE - VIEWPORT_PADDING;
        return {
          x: Math.max(VIEWPORT_PADDING, Math.min(prev.x, maxX)),
          y: Math.max(VIEWPORT_PADDING, Math.min(prev.y, maxY)),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const clampPosition = useCallback((pos: Position): Position => {
    if (typeof window === "undefined") return pos;
    const maxX = window.innerWidth - BUTTON_SIZE - VIEWPORT_PADDING;
    const maxY = window.innerHeight - BUTTON_SIZE - VIEWPORT_PADDING;
    return {
      x: Math.max(VIEWPORT_PADDING, Math.min(pos.x, maxX)),
      y: Math.max(VIEWPORT_PADDING, Math.min(pos.y, maxY)),
    };
  }, []);

  const savePosition = useCallback((pos: Position) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(pos));
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      dragStartRef.current = {
        x: clientX,
        y: clientY,
        posX: position.x,
        posY: position.y,
        time: Date.now(),
      };
      totalDeltaRef.current = 0;
      setIsDragging(true);
    },
    [position]
  );

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragStartRef.current) return;

      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      totalDeltaRef.current = dist;

      const newPos = clampPosition({
        x: dragStartRef.current.posX + deltaX,
        y: dragStartRef.current.posY + deltaY,
      });

      setPosition(newPos);
      
      // Calculate dynamic drag progress if expanding on drag
      const maxDragDistance = 120;
      const progress = Math.min(1, Math.max(0, dist / maxDragDistance));
      setDragProgress(progress);
    },
    [clampPosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setDragProgress(0);

    if (dragStartRef.current) {
      savePosition(position);
    }

    const wasTap = totalDeltaRef.current < 8;
    dragStartRef.current = null;
    return { wasTap, totalDelta: totalDeltaRef.current };
  }, [position, savePosition]);

  return {
    position,
    setPosition,
    isDragging,
    dragProgress,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clampPosition,
  };
}
