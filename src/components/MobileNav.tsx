"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { mobileNavItems } from "@/lib/data";
import { scrollToSection, useActiveSection } from "@/lib/useActiveSection";

const EDGE_GAP = 14;

export default function MobileNav() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const drag = useRef({ dragging: false, moved: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  const [open, setOpen] = useState(false);
  const [snappedLeft, setSnappedLeft] = useState(false);
  const [visible, setVisible] = useState(false);
  const active = useActiveSection(["home", ...mobileNavItems.map((i) => i.id)]);

  const clamp = (x: number, y: number) => {
    const el = wrapRef.current!;
    const maxX = window.innerWidth - el.offsetWidth - EDGE_GAP;
    const maxY = window.innerHeight - el.offsetHeight - EDGE_GAP;
    return {
      x: Math.min(Math.max(x, EDGE_GAP), Math.max(EDGE_GAP, maxX)),
      y: Math.min(Math.max(y, EDGE_GAP), Math.max(EDGE_GAP, maxY)),
    };
  };

  const setPos = (x: number, y: number, animate: boolean) => {
    const el = wrapRef.current!;
    el.style.transition = animate
      ? "left .35s cubic-bezier(.34,1.56,.64,1), top .35s cubic-bezier(.34,1.56,.64,1)"
      : "none";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    setSnappedLeft(x < window.innerWidth / 2);
  };

  useEffect(() => {
    const initPos = () => {
      const el = wrapRef.current!;
      setPos(window.innerWidth - el.offsetWidth - EDGE_GAP, window.innerHeight - el.offsetHeight - 110, false);
    };
    initPos();
    setTimeout(() => setVisible(true), 250);

    const onResize = () => {
      const rect = wrapRef.current!.getBoundingClientRect();
      const c = clamp(rect.left, rect.top);
      setPos(c.x, c.y, false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const d = drag.current;
      if (!d.dragging) return;
      const p = "touches" in e ? e.touches[0] : e;
      const dx = p.clientX - d.startX;
      const dy = p.clientY - d.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        if (!d.moved) setOpen(false);
        d.moved = true;
      }
      if (d.moved && e.cancelable) e.preventDefault();
      const c = clamp(d.origX + dx, d.origY + dy);
      wrapRef.current!.style.left = `${c.x}px`;
      wrapRef.current!.style.top = `${c.y}px`;
    };

    const onPointerUp = () => {
      const d = drag.current;
      if (!d.dragging) return;
      d.dragging = false;
      bubbleRef.current!.classList.remove("dragging");

      const rect = wrapRef.current!.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const snapX = midX < window.innerWidth / 2 ? EDGE_GAP : window.innerWidth - rect.width - EDGE_GAP;
      const clampedY = clamp(rect.left, rect.top).y;
      setPos(snapX, clampedY, true);

      if (!d.moved) setOpen((v) => !v);
    };

    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("touchmove", onPointerMove, { passive: false });
    document.addEventListener("mouseup", onPointerUp);
    document.addEventListener("touchend", onPointerUp);
    return () => {
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("touchend", onPointerUp);
    };
  }, []);

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onOutsideClick);
    return () => document.removeEventListener("click", onOutsideClick);
  }, []);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const d = drag.current;
    d.dragging = true;
    d.moved = false;
    bubbleRef.current!.classList.add("dragging");
    const p = "touches" in e ? e.touches[0] : e;
    d.startX = p.clientX;
    d.startY = p.clientY;
    const rect = wrapRef.current!.getBoundingClientRect();
    d.origX = rect.left;
    d.origY = rect.top;
    wrapRef.current!.style.transition = "none";
  };

  return (
    <div ref={wrapRef} className={`at-wrap${open ? " open" : ""}${snappedLeft ? " snapped-left" : ""}`}>
      <div className="at-menu">
        {mobileNavItems.map((item) => (
          <button
            key={item.id}
            className={`at-menu-item${active === item.id ? " active" : ""}`}
            aria-label={item.label}
            onClick={() => {
              scrollToSection(item.id);
              setOpen(false);
            }}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <button
        ref={bubbleRef}
        className={`at-bubble${visible ? " visible" : ""}`}
        aria-label="Menu"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        <span className="at-bubble-dots">
          <span />
          <span />
          <span />
          <span />
        </span>
      </button>
    </div>
  );
}
