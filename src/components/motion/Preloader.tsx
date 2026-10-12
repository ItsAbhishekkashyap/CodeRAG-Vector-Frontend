"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, markReady, prefersReducedMotion, queueRefresh } from "@/lib/motion";

/** Counts the 17 rules into the vector store, then wipes up to reveal the page. */
export const Preloader: React.FC = () => {
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finish = () => {
      markReady();
      queueRefresh(300);
    };
    if (prefersReducedMotion() || !root.current) {
      setGone(true);
      finish();
      return;
    }
    // repeat visits in the same session skip the count and just lift the curtain
    let seen = false;
    try {
      seen = sessionStorage.getItem("crv-intro") === "1";
      sessionStorage.setItem("crv-intro", "1");
    } catch {}
    if (seen) {
      const tl = gsap.timeline()
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: () => setGone(true) })
        .add(finish, "-=.45");
      return () => {
        tl.kill();
      };
    }
    const o = { n: 0 };
    const tl = gsap
      .timeline()
      .to(o, {
        n: 17,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate() {
          if (num.current) num.current.textContent = String(Math.round(o.n)).padStart(2, "0");
          if (bar.current) bar.current.style.width = `${(o.n / 17) * 100}%`;
        },
      })
      .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut", onComplete: () => setGone(true) }, "+=.15")
      .add(finish, "-=.55");
    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__count">
        <span ref={num}>00</span>
        <small>/17 rules</small>
      </div>
      <div className="loader__row">
        <span>Indexing rules into the vector store</span>
        <span>CodeRAG Vector</span>
      </div>
      <div className="loader__bar" ref={bar} />
    </div>
  );
};
