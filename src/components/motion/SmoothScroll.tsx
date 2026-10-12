"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setLenis, smoothScrollTo, prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis smooth scrolling on wheel/trackpad, native momentum on touch,
 * kept in sync with GSAP ScrollTrigger. Any element with data-lenis-prevent
 * (code blocks, the setup drawer) keeps its own native scrolling.
 */
export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    // in-page anchors marked data-scroll glide to their target
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[data-scroll]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    };
    document.addEventListener("click", onClick);

    if (prefersReducedMotion()) {
      return () => document.removeEventListener("click", onClick);
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.2,
      prevent: (node: HTMLElement) => !!node.closest?.("[data-lenis-prevent]"),
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
};
