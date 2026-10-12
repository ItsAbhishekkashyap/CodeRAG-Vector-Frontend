"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

/* ---------- shared Lenis instance ---------- */
let lenisRef: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenisRef = l;
};
export const getLenis = () => lenisRef;

export function smoothScrollTo(target: string | Element | number, offset = -60) {
  if (typeof window === "undefined") return;
  const el =
    typeof target === "string"
      ? target === "#top"
        ? 0
        : document.querySelector(target)
      : target;
  if (el === null) return;
  if (lenisRef) {
    lenisRef.scrollTo(el as HTMLElement | number, { offset: typeof el === "number" ? 0 : offset, duration: 1.4 });
  } else if (typeof el === "number") {
    window.scrollTo({ top: el, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  } else {
    (el as Element).scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

/* ---------- page scroll lock (menu, drawer) ---------- */
const locks = new Set<string>();
export function lockScroll(key: string, on: boolean) {
  if (on) locks.add(key);
  else locks.delete(key);
  const locked = locks.size > 0;
  document.documentElement.classList.toggle("locked", locked);
  if (lenisRef) (locked ? lenisRef.stop() : lenisRef.start());
}

/* ---------- environment ---------- */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- "page is ready" signal fired when the preloader lifts ---------- */
const READY_EVENT = "crv:ready";
export function markReady() {
  document.documentElement.dataset.ready = "1";
  window.dispatchEvent(new Event(READY_EVENT));
}
export function useReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.documentElement.dataset.ready === "1") {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener(READY_EVENT, on);
    return () => window.removeEventListener(READY_EVENT, on);
  }, []);
  return ready;
}

/* ---------- debounced ScrollTrigger refresh for layout changes ---------- */
let refreshTimer: ReturnType<typeof setTimeout> | undefined;
export function queueRefresh(delay = 120) {
  if (typeof window === "undefined") return;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, delay);
}

/* ---------- text scramble ---------- */
const GLYPHS = "abcdefghijklmnopqrstuvwxyz_/<>{}=";
export function scramble(el: HTMLElement) {
  const node = el as HTMLElement & { _busy?: boolean };
  if (node._busy || node.children.length) return;
  node._busy = true;
  const final = node.dataset.txt || (node.dataset.txt = node.textContent || "");
  let f = 0;
  const total = final.length * 2 + 6;
  const step = () => {
    f++;
    node.textContent = [...final]
      .map((c, i) => (c === " " ? " " : f > i * 2 + 4 ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
      .join("");
    if (f < total) requestAnimationFrame(step);
    else {
      node.textContent = final;
      node._busy = false;
    }
  };
  step();
}
