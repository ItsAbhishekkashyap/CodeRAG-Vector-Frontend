"use client";

import { useEffect, useRef } from "react";

/** Phone-only "Audit a repository" button; stays out of the way of the hero, pinned sections, console, report and footer. */
export const FloatingAudit: React.FC = () => {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const fab = ref.current;
    if (!fab || !("IntersectionObserver" in window)) return;
    const seen: Record<string, boolean> = { hero: true, specimen: false, lenses: false, console: false, report: false, footer: false };
    const update = () => fab.classList.toggle("show", !Object.values(seen).some(Boolean));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (seen[(e.target as HTMLElement).dataset.fabKey as string] = e.isIntersecting));
      update();
    });
    const targets: [string, string][] = [
      [".hero", "hero"],
      ["#specimen", "specimen"],
      ["#lenses", "lenses"],
      ["#command-zone", "console"],
      ["#report", "report"],
      [".footer", "footer"],
    ];
    targets.forEach(([sel, key]) => {
      const el = document.querySelector<HTMLElement>(sel);
      if (el) {
        el.dataset.fabKey = key;
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);

  return (
    <a href="#command-zone" className="fab" ref={ref} data-scroll>
      Audit a repository
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M2 8h12M9 3l5 5-5 5" />
      </svg>
    </a>
  );
};
