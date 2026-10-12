"use client";

import { useEffect, useRef, useState } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

/** Cobalt dot cursor with link and "Open/Close" states, plus magnetic buttons. Mouse only. */
export const Cursor: React.FC = () => {
  const [on, setOn] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    setOn(true);
  }, []);

  useEffect(() => {
    if (!on || !dot.current) return;
    const el = dot.current;
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, raf = 0;
    let magnet: HTMLElement | null = null;

    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const releaseMagnet = () => {
      if (!magnet) return;
      const m = magnet;
      m.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
      m.style.transform = "";
      setTimeout(() => (m.style.transition = ""), 600);
      magnet = null;
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const m = (e.target as Element | null)?.closest?.(".magnetic") as HTMLElement | null;
      if (m !== magnet) releaseMagnet();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        m.style.transform = `translate(${x * 0.25}px,${y * 0.35}px)`;
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const row = t?.closest?.(".file__row");
      const link = t?.closest?.("a,button,input,label");
      el.classList.toggle("is-label", !!row);
      el.classList.toggle("is-link", !row && !!link);
      if (row && label.current) label.current.textContent = row.closest(".file")?.classList.contains("open") ? "Close" : "Open";
    };
    const onClick = (e: MouseEvent) => {
      const row = (e.target as Element | null)?.closest?.(".file__row");
      if (row && label.current) setTimeout(() => {
        if (label.current) label.current.textContent = row.closest(".file")?.classList.contains("open") ? "Close" : "Open";
      }, 0);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      releaseMagnet();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div className="cursor" ref={dot} aria-hidden="true">
      <span ref={label}>Open</span>
    </div>
  );
};
