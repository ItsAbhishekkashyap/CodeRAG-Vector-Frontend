"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const RULES: [string, string][] = [
  ["OOP-001", "Strict encapsulation"], ["DB-003", "ACID transactions"], ["OS-001", "Race conditions"],
  ["NET-002", "SQL injection"], ["OOP-002", "Abstract interfaces"], ["DB-004", "Explicit projection"],
  ["OS-002", "Deadlock prevention"], ["NET-001", "TLS everywhere"], ["OOP-004", "RAII"],
  ["DB-001", "Normalization"], ["OS-003", "Memory leaks"], ["NET-003", "Connection pooling"],
  ["OOP-003", "Virtual destructors"], ["DB-002", "Key constraints"], ["OS-004", "Thread starvation"],
  ["NET-004", "Private subnets"], ["OOP-005", "Scope isolation"],
];

const Group = () => (
  <div style={{ display: "flex" }}>
    {RULES.map(([id, name]) => (
      <div className="marquee__item" key={id}>
        <code>{id}</code>
        <span>{name}</span>
      </div>
    ))}
  </div>
);

/** All 17 rule IDs on a loop; scrolling speeds it up and flips its direction. */
export const Marquee: React.FC = () => {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0, dir = 1, last = window.scrollY, raf = 0, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const loop = () => {
      const y = window.scrollY;
      const v = y - last;
      last = y;
      if (visible) {
        const w = (el.firstElementChild as HTMLElement).offsetWidth;
        if (Math.abs(v) > 0.5) dir = v > 0 ? 1 : -1;
        x -= (0.6 + Math.min(Math.abs(v) * 0.35, 14)) * dir;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={track}>
        <Group />
        <Group />
      </div>
    </div>
  );
};
